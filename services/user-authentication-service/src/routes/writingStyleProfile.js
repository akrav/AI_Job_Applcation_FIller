import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';
import { analyzeWritingStyle } from 'writing-style-analyzer';
import { generateEmbedding } from 'embedding-generator';
import OpenAI from 'openai';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('writing_style_profiles')
			.select('*')
			.eq('user_id', userId)
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('wsp.get error:', error);
			return res.status(400).json({ error: 'READ_FAILED', message: error.message });
		}
		return res.status(200).json(data);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.put('/', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const { profile_data } = req.body || {};
		if (profile_data === undefined) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'profile_data is required' });
		}
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('writing_style_profiles')
			.update({ profile_data })
			.eq('user_id', userId)
			.select('*')
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('wsp.put error:', error);
			return res.status(400).json({ error: 'UPDATE_FAILED', message: error.message });
		}
		return res.status(200).json(data);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

// POST /api/v1/writing-style-profile/generate
// Accepts: { text: string, source?: string, use_openai?: boolean }
router.post('/generate', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const { text, source, use_openai } = req.body || {};
		if (!text || typeof text !== 'string' || !text.trim()) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'text is required' });
		}

		const admin = initSupabaseAdminFromEnv();
		// Load current profile for merging
		const { data: wspRow } = await admin
			.from('writing_style_profiles')
			.select('profile_data')
			.eq('user_id', userId)
			.maybeSingle();
		const existingProfile = wspRow?.profile_data || {};

		// Heuristic analysis first (cheap)
		const basic = analyzeWritingStyle(text);

		let llmProfile = {};
		if (use_openai) {
			llmProfile = await llmGenerateWritingStyleProfile(text, existingProfile);
		}

		const merged = deepMerge({ ...existingProfile, stats: basic }, {
			last_updated_at: new Date().toISOString(),
			profile: llmProfile
		});

		// Persist profile
		await admin
			.from('writing_style_profiles')
			.update({ profile_data: merged })
			.eq('user_id', userId);

		// Chunk text and store embeddings into user_document_chunks for RAG
		const chunkSize = 8000; // chars ~ 2k tokens; safe for small embedding chunks
		const chunks = [];
		for (let i = 0, idx = 0; i < text.length; i += chunkSize, idx += 1) {
			const content = text.slice(i, i + chunkSize);
			chunks.push({ index: idx, content });
		}
		for (const ch of chunks) {
			const emb = await generateEmbedding(ch.content, { useOpenAI: Boolean(use_openai) });
			await admin.from('user_document_chunks').upsert({
				user_id: userId,
				source: source || 'uploaded_text',
				chunk_index: ch.index,
				content: ch.content,
				metadata: { kind: 'wsp_source' },
				embedding: emb
			}, { onConflict: 'user_id,source,chunk_index' });
		}

		return res.status(200).json({ ok: true, profile_data: merged, chunks_added: chunks.length });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('wsp.generate error:', err);
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

function deepMerge(target, source) {
	if (!source || typeof source !== 'object') return target;
	const out = Array.isArray(target) ? [...target] : { ...target };
	for (const [k, v] of Object.entries(source)) {
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			out[k] = deepMerge(target?.[k] || {}, v);
		} else if (Array.isArray(v)) {
			out[k] = Array.from(new Set([...(target?.[k] || []), ...v]));
		} else {
			out[k] = v;
		}
	}
	return out;
}

async function llmGenerateWritingStyleProfile(fullText, existing) {
	const apiKey = process.env.OPENAI_API_KEY || '';
	if (!apiKey) return {};
	const client = new OpenAI({ apiKey });
	const model = process.env.OPENAI_MODEL_WSP || 'gpt-4.1-nano';

	// Token-aware chunking: approx 4 chars ~ 1 token; keep map-calls under ~90k chars
	const maxChars = 90000;
	const chunks = [];
	for (let i = 0; i < fullText.length; i += maxChars) {
		chunks.push(fullText.slice(i, i + maxChars));
	}

	let aggregate = existing?.profile || {};
	const pagesTarget = Number(process.env.WSP_PAGES_TARGET || 15);
	const detailLevel = process.env.WSP_DETAIL || 'exhaustive'; // 'normal' | 'high' | 'exhaustive'

	// Map phase: produce deltas per chunk, merging into aggregate
	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];
		const prompt = buildWritingStylePrompt(chunk, aggregate, { phase: 'map', detailLevel });
		const resp = await client.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You are an expert stylometric and lexical analyst. Return STRICT JSON only.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.15,
			max_tokens: 8000
		});
		const json = safeJson(resp?.choices?.[0]?.message?.content);
		aggregate = deepMerge(aggregate, json || {});
	}

	// Finalize: densify to meet the page target with larger arrays
	const finalizePrompt = buildWritingStylePrompt('', aggregate, { phase: 'finalize', pagesTarget, detailLevel });
	const finalize = await client.chat.completions.create({
		model,
		messages: [
			{ role: 'system', content: 'You are an expert stylometric and lexical analyst. Return STRICT JSON only.' },
			{ role: 'user', content: finalizePrompt }
		],
		temperature: 0.1,
		max_tokens: 12000
	});
	const dense = safeJson(finalize?.choices?.[0]?.message?.content);
	return deepMerge(aggregate, dense || {});
}

function buildWritingStylePrompt(text, existingProfile, opts = {}) {
	const { phase = 'map', pagesTarget = 15, detailLevel = 'exhaustive' } = opts;
	const existing = JSON.stringify(existingProfile || {});
	const minItems = detailLevel === 'exhaustive' ? 150 : detailLevel === 'high' ? 80 : 40;
	const minPerList = Math.max(25, Math.floor(minItems / 6));
	const expansionNote = phase === 'finalize'
		? `Expand the existing profile to reach AT LEAST ${pagesTarget} pages of JSON-equivalent content. Increase list lengths aggressively (≥${minItems} total new items across lists; ≥${minPerList} per list). DO NOT add prose—expand arrays and nested fields only.`
		: 'Produce a delta fragment (partial JSON) rich in NEW items; avoid restating existing values.';

	const header = `Given an existing writing-style profile and (optionally) a new sample, output STRICT JSON that ${phase === 'finalize' ? 'densifies' : 'extends with new evidence'}.`;

	const rules = [
		'Rules:',
		'- Evidence-first; if unknown leave empty.',
		'- Idempotent merge semantics: only add NEW items; dedupe by lowercase string match.',
		`- ${expansionNote}`,
		'- Prefer concrete lists and quantified stats; include numeric estimates where sensible.',
		`- For arrays, aim for ≥${minPerList} entries where applicable (e.g., preferred_vocabulary, words_to_avoid, transitions, metaphors).`,
		'- Be a stickler for the details and be exhaustive',
		'- Below JSON Schemas are not exhaustive but examples, add more fields you find neccesary, to analyze the users writing style',
		'- Output JSON ONLY with keys and nested structure EXACTLY as follows (no extra keys, no prose outside values):'
	].join('\n');

	const schema = [
		'{',
		'  "style_kernel": {',
		'    "syntax": { "avg_sentence_len": [number, number], "semicolon": "preferred|optional|avoid", "parentheses": "allowed|avoid" },',
		'    "voice": { "impersonal_or_passive_preferred": boolean },',
		'    "lexicon": {',
		'      "preferred": string[],',
		'      "banned": string[],',
		'      "synonyms": { string: string }',
		'    },',
		'    "rhetoric": string[],',
		'    "openers": string[],',
		'    "thresholds": { "style_score_min": number, "preferred_terms_min": number }',
		'  },',
		'  "examples": {',
		'    "micro_exemplars": string[]',
		'  },',
		'  "meta": {',
		'    "sample_summary": string,',
		'    "estimated_readability": { "flesch_kincaid_grade": number, "gunning_fog": number, "smog": number },',
		'    "notes": string[]',
		'  },',
		'  "lexical": {',
		'    "preferred_vocabulary": string[],',
		'    "words_to_avoid": string[],',
		'    "banned_words": string[],',
		'    "functional_words": { "connectives": string[], "hedges": string[], "intensifiers": string[] },',
		'    "top_ngrams": { "bigrams": string[], "trigrams": string[] },',
		'    "domain_terms": string[],',
		'    "idiolect": string[]',
		'  },',
		'  "frequency": {',
		'    "type_token_ratio": number,',
		'    "hapax_legomena_rate": number,',
		'    "avg_word_length": number,',
		'    "word_length_histogram": { "1-3": number, "4-6": number, "7-9": number, "10+": number }',
		'  },',
		'  "stylometry": {',
		'    "avg_sentence_length": number,',
		'    "sentence_length_distribution": string,',
		'    "clause_density": number,',
		'    "subordination_ratio": number,',
		'    "paragraph_length_distribution": string,',
		'    "burstiness_notes": string,',
		'    "rhythm": string',
		'  },',
		'  "syntax": {',
		'    "voice_preference": "active|passive|mixed",',
		'    "common_structures": string[],',
		'    "pos_openings": string[],',
		'    "punctuation_usage": {',
		'      "commas": string,',
		'      "semicolons": string,',
		'      "dashes": string,',
		'      "parentheses": string,',
		'      "colons": string,',
		'      "ellipses": string,',
		'      "exclamations": string',
		'    },',
		'    "quote_style": "single|double|mixed"',
		'  },',
		'  "semantics": {',
		'    "themes": string[],',
		'    "rhetorical_moves": string[],',
		'    "transition_words": string[],',
		'    "metaphors": string[],',
		'    "analogies": string[]',
		'  },',
		'  "tone": {',
		'    "overall": string,',
		'    "formality": string,',
		'    "confidence": string,',
		'    "warmth": string,',
		'    "humor": string,',
		'    "directness": string',
		'  },',
		'  "jargon_and_idioms": { "domain_terms": string[], "idioms": string[] },',
		'  "diction_preferences": {',
		'    "prefer": [{ "concept": string, "use": string, "avoid": string }],',
		'    "rewrites": [{ "from": string, "to": string, "rationale": string }]',
		'  },',
		'  "persona_voice": {',
		'    "author_archetype": string,',
		'    "dos": string[],',
		'    "donts": string[],',
		'    "mimic_instructions": string',
		'  },',
		'  "examples": {',
		'    "preferred_phrases": string[],',
		'    "phrase_rewrites": [{ "from": string, "to": string }],',
		'    "sample_rewrite": { "original": string, "humanized": string }',
		'  },',
		'  "style_judge_rubric": {',
		'    "avg_sentence_len_band": [number, number],',
		'    "passive_or_impersonal_preferred": boolean,',
		'    "banned_tokens_absent": boolean,',
		'    "preferred_terms_min": number,',
		'    "require_semicolon": boolean,',
		'    "approved_openers": string[],',
		'    "tone": "formal|informal|objective|persuasive"',
		'  }',
		'}'
	].join('\n');

	const guidance = [
		'Guidance for filling fields:',
		`- "preferred_vocabulary" and "words_to_avoid": include ≥${minPerList} each whenever evidence allows; choose specific, domain-relevant items.`,
		'- "top_ngrams": add distinctive bigrams/trigrams characteristic of the voice.',
		'- "functional_words": capture connectives (however, therefore), hedges (might, perhaps), intensifiers (very, extremely).',
		'- "frequency": estimate metrics; values may be approximate.',
		'- "stylometry": include comments on variability (burstiness) and rhythm in "burstiness_notes" and "rhythm".',
		'- "syntax": describe clause starts ("pos_openings"), typical subordination, and punctuation habits per mark.',
		'- "semantics": list rhetorical moves (problem-solution, contrast, enumeration, narrative), transitions grouped by function.',
		'- "diction_preferences.rewrites": give concrete before→after substitutions with short rationale.',
		'- "persona_voice": consolidate the style into actionable guidance ("mimic_instructions").',
		'- "examples.micro_exemplars": provide 3–6 short, anonymized sentences (20–35 words) that best represent cadence and punctuation habits.'
	].join('\n');

	const tail = [
		`ExistingProfile: ${existing}`,
		'',
		'WritingSample:',
		String(text || '')
	].join('\n');

	return [header, '', rules, schema, '', guidance, '', tail].join('\n');
}

function safeJson(s) {
	try {
		return JSON.parse(String(s || '').replace(/^```json\n?|```$/g, ''));
	} catch (_e) {
		return {};
	}
}

export default router; 