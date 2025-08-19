import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';
import { generateEmbedding } from 'embedding-generator';
import OpenAI from 'openai';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('memory_banks')
			.select('*')
			.eq('user_id', userId)
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('memory_bank.get error:', error);
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
		const { data: payload } = req.body || {};
		if (payload === undefined) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'data is required' });
		}
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('memory_banks')
			.update({ data: payload })
			.eq('user_id', userId)
			.select('*')
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('memory_bank.put error:', error);
			return res.status(400).json({ error: 'UPDATE_FAILED', message: error.message });
		}
		return res.status(200).json(data);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

// POST /api/v1/memory-bank/generate
// Accepts: { text: string, source?: string, use_openai?: boolean }
router.post('/generate', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const { text, source, use_openai } = req.body || {};
		if (!text || typeof text !== 'string' || !text.trim()) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'text is required' });
		}
		const admin = initSupabaseAdminFromEnv();

		// Load existing memory to avoid overwriting
		const { data: mbRow } = await admin
			.from('memory_banks')
			.select('data')
			.eq('user_id', userId)
			.maybeSingle();
		const existing = mbRow?.data || {};

		let extracted = extractHeuristicMemory(text);
		if (use_openai) {
			const llmExtraction = await llmExtractMemory(text, existing);
			extracted = deepMerge(extracted, llmExtraction);
		}
		const merged = deepMerge(existing, extracted);

		await admin
			.from('memory_banks')
			.update({ data: merged })
			.eq('user_id', userId);

		// Chunk and store embeddings for RAG
		const chunkSize = 8000; // chars ~ 2k tokens
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
				metadata: { kind: 'memory_source' },
				embedding: emb
			}, { onConflict: 'user_id,source,chunk_index' });
		}

		return res.status(200).json({ ok: true, data: merged, chunks_added: chunks.length });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('memory_bank.generate error:', err);
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

function extractHeuristicMemory(text) {
	const cleaned = String(text || '');
	const sections = {};
	// naive cues
	const education = cleaned.match(/(Bachelor|Master|PhD|University|College)[^\n]{0,200}/gi) || [];
	const skills = (cleaned.match(/Skills?:[^\n]{0,300}/gi) || []).join('\n');
	const projects = (cleaned.match(/Projects?:[^\n]{0,400}/gi) || []).join('\n');
	sections.professional_history = { education, work_experience: [], certifications: [] };
	sections.professional_skills = { hard_skills: skills ? [skills] : [], soft_skills: [], tools: [], cloud: [], ml: [] };
	sections.stories = {};
	sections.personal_details = { preferences: [] };
	sections.projects = projects ? [projects] : [];
	sections.notable_quotes = [];
	sections.evidence = [];
	return sections;
}

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

async function llmExtractMemory(fullText, existing) {
	const apiKey = process.env.OPENAI_API_KEY || '';
	if (!apiKey) return {};
	const client = new OpenAI({ apiKey });
	const model = process.env.OPENAI_MODEL_MB || 'gpt-4.1-nano';
	const maxChars = 90000; // map-phase
	const chunks = [];
	for (let i = 0; i < fullText.length; i += maxChars) {
		chunks.push(fullText.slice(i, i + maxChars));
	}
	let aggregate = existing || {};
	const pagesTarget = Number(process.env.MB_PAGES_TARGET || 15);
	const minPerCategory = Number(process.env.MB_MIN_PER_CATEGORY || 40);

	// Map phase
	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];
		const prompt = buildMemoryExtractionPrompt(chunk, aggregate, { phase: 'map', minPerCategory });
		const resp = await client.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You extract structured personal/professional memory. Return STRICT JSON only.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.05,
			max_tokens: 9000
		});
		const json = safeJson(resp?.choices?.[0]?.message?.content);
		aggregate = deepMerge(aggregate, json || {});
	}

	// Finalize phase (densify)
	const finalizePrompt = buildMemoryExtractionPrompt('', aggregate, { phase: 'finalize', pagesTarget, minPerCategory: minPerCategory * 2 });
	const finalize = await client.chat.completions.create({
		model,
		messages: [
			{ role: 'system', content: 'You extract structured personal/professional memory. Return STRICT JSON only.' },
			{ role: 'user', content: finalizePrompt }
		],
		temperature: 0.05,
		max_tokens: 12000
	});
	const dense = safeJson(finalize?.choices?.[0]?.message?.content);
	return deepMerge(aggregate, dense || {});
}

function buildMemoryExtractionPrompt(text, existingMemory, opts = {}) {
	const { phase = 'map', pagesTarget = 15, minPerCategory = 40 } = opts;
	const existing = JSON.stringify(existingMemory || {});
	const guidance = phase === 'finalize'
		? `Densify and normalize the existing memory so that the JSON, taken as a whole, would span at least ${pagesTarget} pages worth of structured content. Expand each list to have ≥${minPerCategory} entries where sensible.`
		: `Extract NEW facts only (idempotent update). Emphasize breadth and detail; aim for ≥${minPerCategory} entries per major list when content allows.`;
	return `${guidance}
Merge with existing; DO NOT duplicate; dedupe case-insensitively. Output STRICT JSON ONLY with keys:
{
  "professional_history": {"work_experience": [{"company": string, "role": string, "start": string, "end": string, "achievements": string[]}], "education": string[], "certifications": string[]},
  "professional_skills": {"hard_skills": string[], "soft_skills": string[], "tools": string[], "cloud": string[], "ml": string[]},
  "stories": {"overcoming_challenge": string[], "leading_team": string[], "creative_solution": string[]},
  "personal_details": {"goals": string[], "interests": string[], "preferences": string[]},
  "projects": string[],
  "notable_quotes": string[],
  "evidence": [{"source": string, "snippet": string}]
}

ExistingMemory: ${existing}

Documents:\n${text}`;
}

function safeJson(s) {
	try {
		return JSON.parse(String(s || '').replace(/^```json\n?|```$/g, ''));
	} catch (_e) {
		return {};
	}
}

export default router; 