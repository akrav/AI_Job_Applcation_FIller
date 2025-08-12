import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';

// Load root .env BEFORE importing the app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const shouldRun = process.env.RUN_SUPABASE_IT === '1';
const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const hasEnvs = requiredEnvs.every((k) => !!process.env[k]);

const describeMaybe = shouldRun && hasEnvs ? describe : describe.skip;

let app; // will be imported after dotenv

describeMaybe('POST /api/v1/auth/register (integration)', () => {
  beforeAll(async () => {
    ({ default: app } = await import('../index.js'));
  });

  it('creates auth user and public rows', async () => {
    const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const unique = Date.now();
    const email = `reg-${unique}@gmail.com`;
    const password = 'Password123!';
    const name = 'Test User';

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, name })
      .set('Content-Type', 'application/json');

    expect([201, 409]).toContain(res.status);

    // Lookup user via admin list
    const { data: usersList } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const created = usersList.users.find((u) => u.email === email);
    expect(created).toBeTruthy();

    // Verify public rows
    const { data: userRow } = await admin.from('users').select('*').eq('id', created.id).maybeSingle();
    expect(userRow?.id).toBe(created.id);
    expect(userRow?.name).toBe(name);

    const { data: mbRow } = await admin.from('memory_banks').select('*').eq('user_id', created.id).maybeSingle();
    expect(mbRow?.user_id).toBe(created.id);

    // Cleanup
    await admin.auth.admin.deleteUser(created.id);
  }, 30000);
}); 