import { jest } from '@jest/globals';
import { initSupabaseFromEnv, initSupabaseAdminFromEnv } from '../../src/supabaseClient.js';

describe('Supabase init', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...OLD_ENV };
	});

	afterAll(() => {
		process.env = OLD_ENV;
	});

	test('throws when missing SUPABASE_URL or SUPABASE_ANON_KEY', () => {
		delete process.env.SUPABASE_URL;
		delete process.env.SUPABASE_ANON_KEY;
		expect(() => initSupabaseFromEnv()).toThrow(/Missing Supabase configuration/);
	});

	test('returns client when envs provided (anon)', () => {
		process.env.SUPABASE_URL = 'https://example.supabase.co';
		process.env.SUPABASE_ANON_KEY = 'anon-key';
		const client = initSupabaseFromEnv();
		expect(client).toBeTruthy();
	});

	test('throws when missing SUPABASE_SERVICE_ROLE_KEY for admin', () => {
		process.env.SUPABASE_URL = 'https://example.supabase.co';
		delete process.env.SUPABASE_SERVICE_ROLE_KEY;
		expect(() => initSupabaseAdminFromEnv()).toThrow(/Missing Supabase admin configuration/);
	});

	test('returns admin client when envs provided', () => {
		process.env.SUPABASE_URL = 'https://example.supabase.co';
		process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
		const client = initSupabaseAdminFromEnv();
		expect(client).toBeTruthy();
	});
}); 