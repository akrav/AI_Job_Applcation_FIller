import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('PUT /api/v1/writing-style-profile', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('updates the authenticated user writing style profile', async () => {
		const email = `wspu_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const profile = { tone: 'friendly', average_sentence_length: 18 };
		const res = await request(app)
			.put('/api/v1/writing-style-profile')
			.set('Authorization', `Bearer ${token}`)
			.send({ profile_data: profile })
			.expect(200);

		expect(res.body.profile_data).toMatchObject(profile);
	});
}); 