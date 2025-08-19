import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('PUT /api/v1/memory-bank', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('updates the authenticated user memory bank data', async () => {
		const email = `mbu_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const payload = { professional_skills: { hard_skills: ['node', 'sql'] } };
		const res = await request(app)
			.put('/api/v1/memory-bank')
			.set('Authorization', `Bearer ${token}`)
			.send({ data: payload })
			.expect(200);

		expect(res.body.data).toMatchObject(payload);
	});
}); 