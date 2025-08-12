import { jest } from '@jest/globals';
import { initSupabaseFromEnv } from '../supabaseClient.js';

describe('Supabase client initialization', () => {
  afterEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    jest.resetModules();
  });

  test('throws when SUPABASE_URL or SUPABASE_ANON_KEY missing', () => {
    expect(() => initSupabaseFromEnv()).toThrow('MISSING_SUPABASE_CONFIG');
  });

  test('returns client when env is provided', () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test';
    const client = initSupabaseFromEnv();
    expect(client).toBeTruthy();
  });
}); 