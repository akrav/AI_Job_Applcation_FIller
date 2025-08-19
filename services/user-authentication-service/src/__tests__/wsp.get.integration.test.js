import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('GET /api/v1/writing-style-profile', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('returns the authenticated user writing style profile row', async () => {
		const email = `wsp_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const res = await request(app)
			.get('/api/v1/writing-style-profile')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(res.body).toHaveProperty('user_id');
		expect(res.body).toHaveProperty('profile_data');
	});
}); 