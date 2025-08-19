/**
 * Find similar application answers via Supabase RPC using pgvector.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {number[]} queryEmbedding
 * @param {{ limit?: number }} [options]
 * @returns {Promise<Array<{ id:number, user_id:string, question:string, answer:string, similarity?:number }>>}
 */
export async function findSimilarLines(supabase, userId, queryEmbedding, options = {}) {
	if (!supabase || typeof supabase.rpc !== 'function') throw new Error('Invalid Supabase client');
	if (!userId || typeof userId !== 'string') throw new Error('Invalid userId');
	if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0 || !queryEmbedding.every(n => typeof n === 'number')) {
		throw new Error('Invalid queryEmbedding');
	}
	const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 5;
	const { data, error } = await supabase.rpc('match_application_answers', {
		p_user_id: userId,
		p_query_embedding: queryEmbedding,
		p_match_limit: limit
	});
	if (error) {
		const err = new Error(`VECTOR_SEARCH_FAILED: ${error.message || 'Unknown error'}`);
		err.code = error.code || null;
		throw err;
	}
	return Array.isArray(data) ? data : [];
} 