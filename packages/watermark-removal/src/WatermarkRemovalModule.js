/**
 * Remove AI/statistical watermarks and artifacts from text.
 * Deterministic heuristics plus optional OpenAI refinement using cheapest model.
 *
 * @param {string} text
 * @param {{ useOpenAI?: boolean, openaiApiKey?: string|null, model?: string, openAIClientFactory?: (() => any) }} [options]
 * @returns {Promise<string>}
 */
export async function removeWatermarks(text, options = {}) {
	let out = String(text || '');
	if (!out.trim()) return '';

	// Heuristics: remove stereotypical phrases and uniformity markers
	const patterns = [
		/\bAs an AI (?:assistant|language model)[^.!?]*[.!?]?/gi,
		/\bIn conclusion[:,]?/gi,
		/\bFurthermore[:,]?/gi,
		/\bMoreover[:,]?/gi,
		/\bdelve into\b/gi,
		/\bempower\b/gi
	];
	for (const rx of patterns) out = out.replace(rx, '').trim();

	// Normalize whitespace and punctuation
	out = out
		.replace(/\s{2,}/g, ' ')
		.replace(/\s+([.,;:!?])/g, '$1')
		.replace(/([.!?]){3,}/g, '$1$1')
		.replace(/\.{2,}/g, '.');

	// Optional OpenAI refinement
	if (options.useOpenAI) {
		const apiKey = options.openaiApiKey || process.env.OPENAI_API_KEY || '';
		if (!apiKey) throw new Error('OPENAI_API_KEY missing');
		const model = options.model || 'gpt-4o-mini';
		let client;
		if (typeof options.openAIClientFactory === 'function') client = options.openAIClientFactory();
		else {
			const { default: OpenAI } = await import('openai');
			client = new OpenAI({ apiKey });
		}
		const prompt = `Clean the text by removing AI telltale phrases and statistical watermarks while preserving meaning. Return only the cleaned text.\n\nTEXT:\n${out}`;
		const resp = await client.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You clean AI-generated text to be natural and watermark-free.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.2,
			max_tokens: 600
		});
		const cleaned = resp?.choices?.[0]?.message?.content?.trim();
		if (cleaned) out = cleaned;
	}

	return out.trim();
} 