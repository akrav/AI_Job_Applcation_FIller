import { jest } from '@jest/globals';
import { generateEmbedding } from '../generateEmbedding.js';

describe('generateEmbedding', () => {
	it('returns deterministic vector for same input without OpenAI', async () => {
		const a = await generateEmbedding('hello world', { useOpenAI: false, dimensions: 8 });
		const b = await generateEmbedding('hello world', { useOpenAI: false, dimensions: 8 });
		expect(a).toHaveLength(8);
		expect(b).toHaveLength(8);
		expect(a).toEqual(b);
	});

	it('uses OpenAI when enabled (mocked)', async () => {
		const mockCreate = jest.fn(async () => ({ data: [{ embedding: [0.1, 0.2, 0.3] }] }));
		const client = { embeddings: { create: mockCreate } };
		const vec = await generateEmbedding('text', { useOpenAI: true, openaiApiKey: 'sk-test', model: 'text-embedding-3-small', openAIClientFactory: () => client });
		expect(vec).toEqual([0.1, 0.2, 0.3]);
		expect(mockCreate).toHaveBeenCalled();
	});
}); 