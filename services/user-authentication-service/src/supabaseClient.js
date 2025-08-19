import { createClient } from '@supabase/supabase-js';

export function initSupabaseFromEnv() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY are required');
	}
	if (!/^https:\/\/[^.]+\.supabase\.co/.test(supabaseUrl)) {
		throw new Error(`Invalid SUPABASE_URL format: ${supabaseUrl}`);
	}
	return createClient(supabaseUrl, supabaseAnonKey);
}

export function initSupabaseAdminFromEnv() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!supabaseUrl || !serviceKey) {
		throw new Error('Missing Supabase admin configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
	}
	return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
} 