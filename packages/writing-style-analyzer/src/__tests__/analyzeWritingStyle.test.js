import { analyzeWritingStyle } from '../analyzeWritingStyle.js';

describe('analyzeWritingStyle', () => {
	it('returns neutral profile for empty text', () => {
		const p = analyzeWritingStyle('');
		expect(p.tone).toBe('neutral');
		expect(p.vocabulary.topWords).toEqual([]);
	});

	it('analyzes tone and metrics', () => {
		const text = 'This is a short sentence. This is another one! And a third?';
		const p = analyzeWritingStyle(text);
		expect(['formal', 'concise', 'neutral']).toContain(p.tone);
		expect(p.sentenceStructure.avgSentenceLen).toBeGreaterThan(0);
	});
}); 