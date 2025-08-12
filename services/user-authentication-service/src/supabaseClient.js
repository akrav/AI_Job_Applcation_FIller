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

export function initSupabaseAdminFromEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    const error = new Error('MISSING_SUPABASE_ADMIN_CONFIG');
    error.code = 'MISSING_SUPABASE_ADMIN_CONFIG';
    throw error;
  }
  return createClient(supabaseUrl, serviceRoleKey);
} 