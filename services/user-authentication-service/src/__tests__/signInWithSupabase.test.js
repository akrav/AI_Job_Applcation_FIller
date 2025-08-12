import { jest } from '@jest/globals';
import { signInWithSupabase } from '../auth/signInWithSupabase.js';

function makeMockClient({ signInImpl }) {
  return {
    auth: {
      signInWithPassword: signInImpl,
    },
  };
}

describe('signInWithSupabase', () => {
  test('throws on missing email', async () => {
    await expect(signInWithSupabase('', 'password', makeMockClient({ signInImpl: jest.fn() }))).rejects.toMatchObject({ code: 'EMAIL_REQUIRED' });
  });

  test('throws on missing password', async () => {
    await expect(signInWithSupabase('user@example.com', '', makeMockClient({ signInImpl: jest.fn() }))).rejects.toMatchObject({ code: 'PASSWORD_REQUIRED' });
  });

  test('returns token and expiry on success', async () => {
    const client = makeMockClient({ signInImpl: jest.fn().mockResolvedValue({ data: { session: { access_token: 'abc', expires_in: 3600 } }, error: null }) });
    const result = await signInWithSupabase('user@example.com', 'password123', client);
    expect(result.token).toBe('abc');
    expect(result.expiresAt).toMatch(/Z$/);
  });

  test('throws INVALID_CREDENTIALS for bad login', async () => {
    const client = makeMockClient({ signInImpl: jest.fn().mockResolvedValue({ data: null, error: { status: 400, message: 'Invalid login credentials' } }) });
    await expect(signInWithSupabase('user@example.com', 'wrong', client)).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });
}); 