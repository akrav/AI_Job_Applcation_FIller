import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app;

describe('DELETE /api/v1/templates/:id', () => {
	beforeAll(async () => {
		({ default: app } = await import('../../src/index.js'));
	});

	it('deletes a template owned by the authenticated user', async () => {
		const email = `delete_${Date.now()}@gmail.com`;
		const password = 'ValidPassw0rd!123';

		await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
		const login = await request(app).post('/api/v1/auth/login').send({ email, password }).expect(200);
		const token = login.body.access_token;

		const created = await request(app)
			.post('/api/v1/templates')
			.set('Authorization', `Bearer ${token}`)
			.send({ content: 'To delete', placeholders: {} })
			.expect(201);

		const id = created.body.id;
		await request(app)
			.delete(`/api/v1/templates/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);
	});
}); 