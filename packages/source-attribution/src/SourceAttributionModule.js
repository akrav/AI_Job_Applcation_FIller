/**
 * Save source attribution for a generated line.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseAdmin - service role client
 * @param {string} userId
 * @param {{ placeholder?: string, line_text: string, source_url: string, quote_text: string }} payload
 * @returns {Promise<{ id:number }>} inserted id
 */
export async function saveSourceAttribution(supabaseAdmin, userId, payload) {
	if (!supabaseAdmin || typeof supabaseAdmin.from !== 'function') throw new Error('Invalid Supabase client');
	if (!userId) throw new Error('Invalid userId');
	const { line_text, source_url, quote_text, placeholder = null } = payload || {};
	if (!line_text || !source_url || !quote_text) throw new Error('Missing fields');
	const { data, error } = await supabaseAdmin
		.from('source_attributions')
		.insert({ user_id: userId, line_text, source_url, quote_text, placeholder })
		.select('id')
		.single();
	if (error) {
		const err = new Error(`SAVE_SOURCE_ATTR_FAILED: ${error.message || 'Unknown error'}`);
		err.code = error.code || null;
		throw err;
	}
	return data;
} 