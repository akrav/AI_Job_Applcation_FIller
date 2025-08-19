import { jest } from '@jest/globals';
import { generateLines } from '../generateLines.js';

describe('generateLines', () => {
	it('returns 3 deterministic lines by default without OpenAI', async () => {
		const memory = { personal_details: { name: 'I' }, professional_skills: { hard_skills: ['analysis'] } };
		const ctx = { company: 'Acme' };
		const lines = await generateLines('[CUSTOM_INSPIRED_LINE]', {}, memory, ctx, { useOpenAI: false });
		expect(lines).toHaveLength(3);
		lines.forEach(l => expect(typeof l).toBe('string'));
	});

	it('uses OpenAI when enabled (mocked) to return count lines', async () => {
		const mockText = '* Line A\n* Line B\n* Line C\n* Line D';
		const mockCreate = jest.fn(async () => ({ choices: [{ message: { content: mockText } }] }));
		const client = { chat: { completions: { create: mockCreate } } };
		const lines = await generateLines('PLACEHOLDER', {}, {}, {}, { useOpenAI: true, openaiApiKey: 'sk-test', count: 4, openAIClientFactory: () => client });
		expect(lines).toEqual(['Line A', 'Line B', 'Line C', 'Line D']);
		expect(mockCreate).toHaveBeenCalled();
	});
}); 