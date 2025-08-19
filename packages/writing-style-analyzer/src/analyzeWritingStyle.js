/**
 * Analyze writing style heuristically (deterministic, no external API).
 * @param {string} text
 * @returns {{tone:string, vocabulary:{avgWordLen:number, topWords:string[]}, sentenceStructure:{avgSentenceLen:number}, punctuation:{commaRate:number,semicolonRate:number}}}
 */
export function analyzeWritingStyle(text) {
	const cleaned = (text || '').trim();
	if (!cleaned) {
		return {
			tone: 'neutral',
			vocabulary: { avgWordLen: 0, topWords: [] },
			sentenceStructure: { avgSentenceLen: 0 },
			punctuation: { commaRate: 0, semicolonRate: 0 }
		};
	}
	const words = cleaned
		.toLowerCase()
		.replace(/[^a-z0-9\s']/g, ' ')
		.split(/\s+/)
		.filter(Boolean);
	const sentences = cleaned.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

	const avgWordLen = words.length ? words.reduce((a, w) => a + w.length, 0) / words.length : 0;
	const avgSentenceLen = sentences.length ? sentences.reduce((a, s) => a + s.split(/\s+/).filter(Boolean).length, 0) / sentences.length : 0;

	const freq = new Map();
	for (const w of words) {
		if (w.length <= 3) continue;
		freq.set(w, (freq.get(w) || 0) + 1);
	}
	const topWords = Array.from(freq.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([w]) => w);

	const commaRate = (cleaned.match(/,/g) || []).length / Math.max(1, sentences.length);
	const semicolonRate = (cleaned.match(/;/g) || []).length / Math.max(1, sentences.length);

	const tone = avgSentenceLen > 20 ? 'formal' : avgSentenceLen < 12 ? 'concise' : 'neutral';

	return {
		tone,
		vocabulary: { avgWordLen: Number(avgWordLen.toFixed(2)), topWords },
		sentenceStructure: { avgSentenceLen: Number(avgSentenceLen.toFixed(2)) },
		punctuation: { commaRate: Number(commaRate.toFixed(2)), semicolonRate: Number(semicolonRate.toFixed(2)) }
	};
} 