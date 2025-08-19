import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('POST /api/v1/generate/ad-hoc-answer', () => {
	beforeAll(async () => {
		({ default: app } = await import('../index.js'));
	});

	it('returns an ad-hoc answer using provided content', async () => {
		const email = `adhoc_${Date.now()}@example.com`;
		const password = 'Password123!';
		await request(app).post('/api/v1/auth/register').send({ email, password }).expect([200,201]);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const company_content = 'We are Globex Inc. Our mission is to innovate.';
		const res = await request(app)
			.post('/api/v1/generate/ad-hoc-answer')
			.set('Authorization', `Bearer ${token}`)
			.send({ question: 'Why do you want to work here?', company_content, use_openai: false, length: 'short' })
			.expect(200);
		expect(typeof res.body.answer).toBe('string');
		expect(res.body.answer.length).toBeGreaterThan(10);
	});
}); 