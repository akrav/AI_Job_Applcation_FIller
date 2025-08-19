import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('POST /api/v1/templates', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('creates a template for the authenticated user', async () => {
		const email = `tpl_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const res = await request(app)
			.post('/api/v1/templates')
			.set('Authorization', `Bearer ${token}`)
			.send({ content: 'Hello', placeholders: { NAME: true } })
			.expect(201);

		expect(res.body).toMatchObject({ content: 'Hello' });
		expect(res.body.user_id).toBeTruthy();
	});
}); 