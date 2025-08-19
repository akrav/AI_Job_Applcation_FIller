import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('GET /api/v1/templates', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('lists only the authenticated user templates', async () => {
		const email = `list_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		await request(app)
			.post('/api/v1/templates')
			.set('Authorization', `Bearer ${token}`)
			.send({ content: 'T1', placeholders: {} })
			.expect(201);

		const res = await request(app)
			.get('/api/v1/templates')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(1);
		for (const t of res.body) {
			expect(t.user_id).toBeTruthy();
		}
	});
}); 