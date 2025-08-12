import { initSupabaseFromEnv } from '../supabaseClient.js';

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`${name}_REQUIRED`);
    error.code = `${name}_REQUIRED`;
    throw error;
  }
}

export async function createUserInSupabase(email, password, client) {
  assertNonEmptyString(email, 'EMAIL');
  assertNonEmptyString(password, 'PASSWORD');

  const supabase = client || initSupabaseFromEnv();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    const msg = (error.message || '').toLowerCase();
    const normalized = new Error('SIGNUP_FAILED');
    // Normalize common duplicate email messages
    if (
      error.status === 422 ||
      msg.includes('already registered') ||
      msg.includes('already exists') ||
      msg.includes('user already') ||
      msg.includes('duplicate')
    ) {
      normalized.code = 'EMAIL_ALREADY_EXISTS';
      throw normalized;
    }
    normalized.code = error.code || 'SIGNUP_FAILED';
    normalized.details = error.message;
    throw normalized;
  }

  return {
    userId: data?.user?.id || null,
    email: data?.user?.email || email.toLowerCase(),
  };
} 