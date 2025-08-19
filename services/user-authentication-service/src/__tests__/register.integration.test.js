import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSupabaseAdminFromEnv } from '../../src/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });
// ---- ENV DEBUG (safe) ----
const url = process.env.SUPABASE_URL || '';
const refMatch = url.match(/https:\/\/([^.]+)\.supabase\.co/);
// eslint-disable-next-line no-console
console.log('[ENV CHECK@test]', {
	ENV_PATH: envPath,
	SUPABASE_URL_OK: Boolean(url),
	PROJECT_REF: refMatch ? refMatch[1] : null,
	ANON_SET: Boolean(process.env.SUPABASE_ANON_KEY),
	SERVICE_SET: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
	NODE_ENV: process.env.NODE_ENV || null
});

let app;

describe('POST /api/v1/auth/register', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('registers a user and verifies it exists in auth.users', async () => {
		const email = `user_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		const res = await request(app)
			.post('/api/v1/auth/register')
			.send({ email, password });

		if (res.status !== 201) {
			// eslint-disable-next-line no-console
			console.log('Register response', res.status, res.body);
		}
		expect(res.status).toBe(201);
		expect(res.body.userId).toBeTruthy();

		const admin = initSupabaseAdminFromEnv();
		const { data: list, error } = await admin.auth.admin.listUsers({ email });
		expect(error).toBeFalsy();
		const found = list.users.find(u => u.email === email);
		expect(found).toBeTruthy();
	});
}); 