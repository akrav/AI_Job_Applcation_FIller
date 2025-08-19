import { jest } from '@jest/globals';
import { saveSourceAttribution } from '../SourceAttributionModule.js';

describe('saveSourceAttribution', () => {
	it('inserts and returns id', async () => {
		const single = jest.fn(async () => ({ data: { id: 42 }, error: null }));
		const select = jest.fn(() => ({ single }));
		const insert = jest.fn(() => ({ select }));
		const from = jest.fn(() => ({ insert }));
		const supabase = { from };
		const res = await saveSourceAttribution(supabase, 'u1', { line_text: 'L', source_url: 'https://x', quote_text: 'Q', placeholder: 'P' });
		expect(res).toEqual({ id: 42 });
		expect(from).toHaveBeenCalledWith('source_attributions');
	});

	it('throws on missing fields', async () => {
		await expect(saveSourceAttribution({ from(){} }, 'u1', { line_text: '' })).rejects.toThrow(/Missing fields/);
	});

	it('throws on supabase error', async () => {
		const single = jest.fn(async () => ({ data: null, error: { message: 'boom', code: 'ERR' } }));
		const select = jest.fn(() => ({ single }));
		const insert = jest.fn(() => ({ select }));
		const from = jest.fn(() => ({ insert }));
		const supabase = { from };
		await expect(saveSourceAttribution(supabase, 'u1', { line_text: 'L', source_url: 'https://x', quote_text: 'Q' })).rejects.toThrow(/SAVE_SOURCE_ATTR_FAILED/);
	});
}); 