import { jest } from '@jest/globals';
import { removeWatermarks } from '../WatermarkRemovalModule.js';

describe('removeWatermarks', () => {
	it('removes common phrases and normalizes punctuation', async () => {
		const input = 'As an AI language model, I can help. In conclusion, this is fine.. Furthermore, great!';
		const out = await removeWatermarks(input, { useOpenAI: false });
		expect(out).not.toMatch(/As an AI/i);
		expect(out).not.toMatch(/In conclusion/i);
		expect(out).not.toMatch(/Furthermore/i);
		expect(out).not.toMatch(/\.\./);
	});

	it('uses OpenAI refinement when enabled (mocked)', async () => {
		const mockCreate = jest.fn(async () => ({ choices: [{ message: { content: 'Cleaned text.' } }] }));
		const client = { chat: { completions: { create: mockCreate } } };
		const out = await removeWatermarks('input', { useOpenAI: true, openaiApiKey: 'sk-test', openAIClientFactory: () => client });
		expect(out).toBe('Cleaned text.');
		expect(mockCreate).toHaveBeenCalled();
	});
}); 