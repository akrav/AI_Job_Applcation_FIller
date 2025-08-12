import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { initSupabaseFromEnv } from '../supabaseClient.js';
import { createUserInSupabase } from '../auth/createUserInSupabase.js';
import { createClient } from '@supabase/supabase-js';

// Load root .env (repo root is 4 levels up from this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const shouldRun = process.env.RUN_SUPABASE_IT === '1';
const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const hasEnvs = requiredEnvs.every((k) => !!process.env[k]);

const itMaybe = shouldRun && hasEnvs ? it : it.skip;

describe('Supabase integration (optional)', () => {
  it('is disabled by default. Enable with RUN_SUPABASE_IT=1 and required envs.', () => {
    expect(true).toBe(true);
  });

  itMaybe('creates, verifies and deletes a user', async () => {
    const anonClient = initSupabaseFromEnv();
    const adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const unique = Date.now();
    const email = `it-${unique}@gmail.com`;
    const password = 'Password123!';

    let userId;
    try {
      // Create via low-level function
      const result = await createUserInSupabase(email, password, anonClient);
      expect(result.userId).toBeTruthy();
      expect(result.email).toBe(email);
      userId = result.userId;

      // Verify via admin API
      const { data: adminData, error: adminErr } = await adminClient.auth.admin.getUserById(userId);
      expect(adminErr).toBeNull();
      expect(adminData?.user?.email).toBe(email);
    } finally {
      if (userId) {
        await adminClient.auth.admin.deleteUser(userId);
      }
    }
  }, 20000);
}); 