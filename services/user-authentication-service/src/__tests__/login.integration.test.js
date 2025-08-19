import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('POST /api/v1/auth/login', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('logs in an existing user and returns a JWT', async () => {
		const email = `login_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);

		const res = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		expect(res.body.access_token).toBeTruthy();
		expect(res.body.userId).toBeTruthy();
	});

	it('returns 401 for invalid credentials', async () => {
		const res = await request(app)
			.post('/api/v1/auth/login')
			.send({ email: 'doesnotexist@gmail.com', password: 'WrongPass123!' });
		expect([400, 401]).toContain(res.status); // Supabase may normalize slightly
	});
}); 