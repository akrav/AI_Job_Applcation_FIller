import { createClient } from '@supabase/supabase-js';

export function initSupabaseFromEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    const error = new Error('MISSING_SUPABASE_CONFIG');
    error.code = 'MISSING_SUPABASE_CONFIG';
    throw error;
  }
  return createClient(supabaseUrl, supabaseKey);
} 