import { initSupabaseFromEnv } from '../supabaseClient.js';

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`${name}_REQUIRED`);
    error.code = `${name}_REQUIRED`;
    throw error;
  }
}

export async function signInWithSupabase(email, password, client) {
  assertNonEmptyString(email, 'EMAIL');
  assertNonEmptyString(password, 'PASSWORD');

  const supabase = client || initSupabaseFromEnv();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = (error.message || '').toLowerCase();
    const normalized = new Error('SIGNIN_FAILED');
    if (
      error.status === 400 ||
      msg.includes('invalid') ||
      msg.includes('wrong') ||
      msg.includes('incorrect')
    ) {
      normalized.code = 'INVALID_CREDENTIALS';
      throw normalized;
    }
    normalized.code = error.code || 'SIGNIN_FAILED';
    normalized.details = error.message;
    throw normalized;
  }

  const session = data?.session || null;
  const token = session?.access_token || null;
  let expiresAt = null;
  if (session?.expires_at) {
    // expires_at is epoch seconds in supabase-js v2
    expiresAt = new Date(session.expires_at * 1000).toISOString();
  } else if (session?.expires_in) {
    expiresAt = new Date(Date.now() + session.expires_in * 1000).toISOString();
  }

  return { token, expiresAt };
} 