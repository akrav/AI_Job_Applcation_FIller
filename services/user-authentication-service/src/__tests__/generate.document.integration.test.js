import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

let app;

describe('POST /api/v1/generate/document', () => {
	beforeAll(async () => {
		// dynamic import after env
		const mod = await import('../index.js');
		app = mod.default;
	});

	it('generates a document and options without OpenAI using provided content', async () => {
		// Register + login
		const email = `gen_${Date.now()}@example.com`;
		const password = 'Password123!';
		const reg = await request(app).post('/api/v1/auth/register').send({ email, password });
		expect([200,201]).toContain(reg.status);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password });
		expect(login.status).toBe(200);
		const token = login.body.access_token;

		const template = 'Hello [CUSTOM_INSPIRED_LINE], Regards';
		const company_content = 'We are Acme Corp and we value innovation.';
		const resp = await request(app)
			.post('/api/v1/generate/document')
			.set('authorization', `Bearer ${token}`)
			.send({ template, company_content, use_openai: false });

		expect(resp.status).toBe(200);
		expect(typeof resp.body.document).toBe('string');
		expect(resp.body.document).not.toMatch(/\[CUSTOM_INSPIRED_LINE\]/);
		expect(resp.body.options).toBeTruthy();
	});
}); 