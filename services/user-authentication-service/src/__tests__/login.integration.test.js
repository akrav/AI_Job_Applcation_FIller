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

describeMaybe('POST /api/v1/auth/login (integration)', () => {
  beforeAll(async () => {
    ({ default: app } = await import('../index.js'));
  });

  it('returns JWT for valid credentials', async () => {
    const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const unique = Date.now();
    const email = `login-${unique}@gmail.com`;
    const password = 'Password123!';

    // Create user via registration endpoint
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, name: 'Login Tester' })
      .set('Content-Type', 'application/json');
    expect([201, 409]).toContain(reg.status);

    // Find the created user
    const { data: usersList } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const created = usersList.users.find((u) => u.email === email);
    expect(created).toBeTruthy();

    // Ensure email is confirmed to allow password login
    await admin.auth.admin.updateUserById(created.id, { email_confirm: true });

    // Login
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');

    // Cleanup auth user
    await admin.auth.admin.deleteUser(created.id);
  }, 30000);
}); 