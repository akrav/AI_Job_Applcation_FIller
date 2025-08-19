/**
 * Generate a numeric vector embedding for input text.
 * Uses deterministic fallback when OpenAI is disabled/unavailable.
 *
 * @param {string} text
 * @param {{ useOpenAI?: boolean, openaiApiKey?: string|null, model?: string, openAIClientFactory?: (() => any), dimensions?: number }} [options]
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text, options = {}) {
	const input = String(text || '');
	if (!input.trim()) return [];

	if (options.useOpenAI) {
		const apiKey = options.openaiApiKey || process.env.OPENAI_API_KEY || '';
		if (!apiKey) throw new Error('OPENAI_API_KEY missing');
		const model = options.model || 'text-embedding-3-small'; // cheapest embedding model
		let client;
		if (typeof options.openAIClientFactory === 'function') {
			client = options.openAIClientFactory();
		} else {
			const { default: OpenAI } = await import('openai');
			client = new OpenAI({ apiKey });
		}
		const resp = await client.embeddings.create({ model, input });
		const vec = resp?.data?.[0]?.embedding;
		if (Array.isArray(vec)) return vec.map(Number);
	}

	// Deterministic fallback: hash -> pseudo-random vector
	const dim = options.dimensions && options.dimensions > 0 ? options.dimensions : 128;
	const seed = murmur32(input);
	const rng = mulberry32(seed);
	const arr = new Array(dim);
	for (let i = 0; i < dim; i++) arr[i] = rng() * 2 - 1; // [-1,1)
	return arr;
}

function murmur32(str) {
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
		h >>>= 0;
	}
	return h >>> 0;
}

function mulberry32(a) {
	return function() {
		a |= 0; a = a + 0x6D2B79F5 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
} 