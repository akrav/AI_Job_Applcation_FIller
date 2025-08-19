import { jest } from '@jest/globals';
import { findSimilarLines } from '../findSimilarLines.js';

describe('findSimilarLines', () => {
	it('calls RPC with expected params and returns rows', async () => {
		const rows = [{ id: 1, user_id: 'u1', question: 'Q', answer: 'A', similarity: 0.12 }];
		const rpc = jest.fn(async (_name, _args) => ({ data: rows, error: null }));
		const supabase = { rpc };
		const res = await findSimilarLines(supabase, 'u1', [0.1, 0.2, 0.3], { limit: 3 });
		expect(rpc).toHaveBeenCalledWith('match_application_answers', expect.objectContaining({ p_user_id: 'u1', p_match_limit: 3 }));
		expect(res).toEqual(rows);
	});

	it('throws on rpc error', async () => {
		const rpc = jest.fn(async () => ({ data: null, error: { message: 'boom', code: 'ERR' } }));
		const supabase = { rpc };
		await expect(findSimilarLines(supabase, 'u1', [0.1], {})).rejects.toThrow(/VECTOR_SEARCH_FAILED/);
	});

	it('validates inputs', async () => {
		await expect(findSimilarLines(null, 'u1', [0.1])).rejects.toThrow(/Invalid Supabase/);
		await expect(findSimilarLines({ rpc(){} }, '', [0.1])).rejects.toThrow(/Invalid userId/);
		await expect(findSimilarLines({ rpc(){} }, 'u1', 'bad')).rejects.toThrow(/Invalid queryEmbedding/);
	});
}); 