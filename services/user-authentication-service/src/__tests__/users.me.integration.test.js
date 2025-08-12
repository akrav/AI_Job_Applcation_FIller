import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';

// Load root .env BEFORE importing the app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

let app; // will import dynamically after env

const shouldRun = process.env.RUN_SUPABASE_IT === '1';
const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const hasEnvs = requiredEnvs.every((k) => !!process.env[k]);

const describeMaybe = shouldRun && hasEnvs ? describe : describe.skip;

describeMaybe('GET /api/v1/users/me (integration)', () => {
  beforeAll(async () => {
    ({ default: app } = await import('../index.js'));
  });

  it('returns own profile with valid JWT', async () => {
    const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const unique = Date.now();
    const email = `me-${unique}@gmail.com`;
    const password = 'Password123!';
    const name = 'Profile User';

    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, name })
      .set('Content-Type', 'application/json');
    expect([201, 409]).toContain(reg.status);

    const { data: usersList } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const created = usersList.users.find((u) => u.email === email);
    expect(created).toBeTruthy();
    await admin.auth.admin.updateUserById(created.id, { email_confirm: true });

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .set('Content-Type', 'application/json');
    expect(login.status).toBe(200);

    const token = login.body.token;
    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(email);
    expect(me.body.name).toBe(name);

    await admin.auth.admin.deleteUser(created.id);
  }, 30000);
}); 