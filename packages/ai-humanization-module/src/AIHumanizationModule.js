/**
 * Humanize text by purging common LLM artifacts, adjusting sentence length, and
 * applying lexical substitutions based on a user's writing profile.
 * Optionally, augment with an LLM call (cheapest model) if enabled.
 *
 * @param {string} text
 * @param {{ vocabulary?: { preferred?: Record<string,string> }, tone?: string }} userProfile
 * @param {{ useOpenAI?: boolean, openaiApiKey?: string|null, model?: string, openAIClientFactory?: (() => any) }} [options]
 * @returns {Promise<string>}
 */
export async function humanizeText(text, userProfile = {}, options = {}) {
	const source = String(text || '');
	let transformed = source;

	// 1) Pattern purging: remove common boilerplate phrases
	// Remove at start of text or sentence-initial (after ., !, ? and whitespace)
	const sentencePurge = [
		'In conclusion', 'Furthermore', 'Moreover', 'In summary', "Let's delve into"
	];
	const boundary = '(^|[.!?]\s+)';
	const purgeRegex = new RegExp(
		boundary + '(?:' + sentencePurge.map(p => escapeRegExp(p)).join('|') + ')[,:]?\s*',
		'gi'
	);
	transformed = transformed.replace(purgeRegex, '$1');

	// Also remove generic phrases anywhere
	const genericPhrases = [
		/\bas an ai language model\b/gi,
		/\bi apologize for any inconvenience\b/gi
	];
	for (const rx of genericPhrases) transformed = transformed.replace(rx, '');

	// Fallback: aggressively remove sentence-starter phrases anywhere if still present
	for (const phrase of sentencePurge) {
		const rx = new RegExp(`\\b${escapeRegExp(phrase)}[,:]?\\s*`, 'gi');
		transformed = transformed.replace(rx, '');
	}

	transformed = transformed
		.replace(/\s{2,}/g, ' ')
		.replace(/\s+([.,;:!?])/g, '$1');

	// 2) Sentence length adjustment: introduce light variation
	const sentences = transformed.split(/([.!?])\s+/);
	let rebuilt = '';
	for (let i = 0; i < sentences.length; i += 2) {
		const sentence = (sentences[i] || '').trim();
		const punct = sentences[i + 1] || '';
		if (!sentence) continue;
		const words = sentence.split(/\s+/).filter(Boolean);
		if (words.length > 30) {
			const mid = Math.floor(words.length / 2);
			rebuilt += words.slice(0, mid).join(' ') + '. ' + words.slice(mid).join(' ');
			if (punct && punct !== '.') rebuilt += punct + ' ';
		} else {
			rebuilt += sentence + (punct || '.') + ' ';
		}
	}
	transformed = rebuilt.trim();

	// 3) Lexical substitutions
	const preferred = userProfile?.vocabulary?.preferred || {};
	if (preferred && typeof preferred === 'object') {
		for (const [fromWord, toWord] of Object.entries(preferred)) {
			if (!fromWord || !toWord) continue;
			const rx = new RegExp(`\\b${escapeRegExp(fromWord)}\\b`, 'gi');
			transformed = transformed.replace(rx, (m) => matchCasing(toWord, m));
		}
	}

	// Normalize duplicate periods / whitespace
	transformed = transformed.replace(/\.{2,}/g, '.').replace(/\s{2,}/g, ' ').trim();

	// 4) Optional OpenAI refinement (cheapest model)
	if (options?.useOpenAI) {
		const apiKey = options.openaiApiKey || process.env.OPENAI_API_KEY || '';
		if (!apiKey) throw new Error('OPENAI_API_KEY missing');
		const model = options.model || 'gpt-4o-mini';
		let client;
		if (typeof options.openAIClientFactory === 'function') {
			client = options.openAIClientFactory();
		} else {
			const { default: OpenAI } = await import('openai');
			client = new OpenAI({ apiKey });
		}
		const prompt = `Refine the following text to sound natural and human, removing boilerplate and preserving meaning. Keep it concise and authentic.\n\nTEXT:\n${transformed}`;
		const resp = await client.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You refine text to be natural and human, concise, and in the user\'s style.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.3,
			max_tokens: 500
		});
		const candidate = resp?.choices?.[0]?.message?.content?.trim();
		if (candidate) transformed = candidate;
	}

	return transformed;
}

function escapeRegExp(s) {
	return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchCasing(replacement, sample) {
	if (sample.toUpperCase() === sample) return replacement.toUpperCase();
	if (sample[0] && sample[0] === sample[0].toUpperCase()) {
		return replacement[0].toUpperCase() + replacement.slice(1);
	}
	return replacement;
} 