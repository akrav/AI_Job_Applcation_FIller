import { jest } from '@jest/globals';
import { createUserInSupabase } from '../auth/createUserInSupabase.js';

function makeMockClient({ signUpImpl }) {
  return {
    auth: {
      signUp: signUpImpl,
    },
  };
}

describe('createUserInSupabase', () => {
  test('throws on missing email', async () => {
    await expect(createUserInSupabase('', 'password', makeMockClient({ signUpImpl: jest.fn() }))).rejects.toMatchObject({ code: 'EMAIL_REQUIRED' });
  });

  test('throws on missing password', async () => {
    await expect(createUserInSupabase('user@example.com', '', makeMockClient({ signUpImpl: jest.fn() }))).rejects.toMatchObject({ code: 'PASSWORD_REQUIRED' });
  });

  test('creates user successfully', async () => {
    const fakeUser = { id: '123', email: 'new@example.com' };
    const client = makeMockClient({ signUpImpl: jest.fn().mockResolvedValue({ data: { user: fakeUser }, error: null }) });
    const result = await createUserInSupabase('new@example.com', 'password123', client);
    expect(result).toEqual({ userId: '123', email: 'new@example.com' });
  });

  test('throws EMAIL_ALREADY_EXISTS for duplicate email (normalized)', async () => {
    const client = makeMockClient({ signUpImpl: jest.fn().mockResolvedValue({ data: null, error: { status: 422, message: 'User already registered' } }) });
    await expect(createUserInSupabase('dupe@example.com', 'password123', client)).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
  });
}); 