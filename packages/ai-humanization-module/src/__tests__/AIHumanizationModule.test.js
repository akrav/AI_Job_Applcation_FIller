import { jest } from '@jest/globals';
import { humanizeText } from '../AIHumanizationModule.js';

describe('AIHumanizationModule.humanizeText', () => {
	it('purges patterns and applies substitutions', async () => {
		const input = 'In conclusion, I will utilize my skills. Furthermore, I can leverage tools.';
		const profile = { vocabulary: { preferred: { utilize: 'use', leverage: 'apply' } } };
		const out = await humanizeText(input, profile, { useOpenAI: false });
		expect(out).not.toMatch(/In conclusion/i);
		expect(out).not.toMatch(/Furthermore/i);
		expect(out).toMatch(/use my skills/);
		expect(out).toMatch(/apply tools/);
		// no double periods
		expect(out).not.toMatch(/\.\./);
	});

	it('handles long sentences by splitting', async () => {
		const long = 'This sentence has many words that should probably be split into two separate sentences because it is overly long and might read robotic to some readers who prefer brevity and clarity in communication when evaluating text.';
		const out = await humanizeText(long, {}, { useOpenAI: false });
		expect(out.split('.').length).toBeGreaterThan(1);
	});

	it('optionally uses OpenAI via injectable factory', async () => {
		const mockCreate = jest.fn(async () => ({ choices: [{ message: { content: 'Refined by OpenAI.' } }] }));
		const client = { chat: { completions: { create: mockCreate } } };
		const out = await humanizeText('Text', {}, { useOpenAI: true, openaiApiKey: 'sk-test', model: 'gpt-4o-mini', openAIClientFactory: () => client });
		expect(out).toBe('Refined by OpenAI.');
		expect(mockCreate).toHaveBeenCalled();
	});
}); 