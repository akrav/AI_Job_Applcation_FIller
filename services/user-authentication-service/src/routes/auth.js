import { Router } from 'express';
import { createUserInSupabase } from '../auth/createUserInSupabase.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';
import { signInWithSupabase } from '../auth/signInWithSupabase.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    const { userId } = await createUserInSupabase(email, password);

    // Create/merge public.users and memory_banks rows with admin privileges
    const admin = initSupabaseAdminFromEnv();

    // Upsert into public.users to ensure name is set even if trigger pre-seeded row
    const { error: userErr } = await admin
      .schema('public')
      .from('users')
      .upsert({ id: userId, email, name: name ?? null }, { onConflict: 'id' });
    if (userErr) {
      // eslint-disable-next-line no-console
      console.error('USER_ROW_UPSERT_FAILED:', userErr);
      return res.status(500).json({ error: 'USER_ROW_UPSERT_FAILED', message: userErr.message });
    }

    // Upsert into public.memory_banks (trigger may have inserted already)
    const { error: mbErr } = await admin
      .schema('public')
      .from('memory_banks')
      .upsert({ user_id: userId, data: {} }, { onConflict: 'user_id' });
    if (mbErr) {
      // eslint-disable-next-line no-console
      console.error('MEMORY_BANKS_UPSERT_FAILED:', mbErr);
      return res.status(500).json({ error: 'MEMORY_BANKS_UPSERT_FAILED', message: mbErr.message });
    }

    return res.status(201).json({ message: 'registered' });
  } catch (e) {
    if (e?.code === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'duplicate_email' });
    }
    if (e?.code === 'EMAIL_REQUIRED' || e?.code === 'PASSWORD_REQUIRED') {
      return res.status(400).json({ error: 'bad_request' });
    }
    // eslint-disable-next-line no-console
    console.error('REGISTER_INTERNAL_ERROR:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const { token, expiresAt } = await signInWithSupabase(email, password);
    if (!token) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    return res.status(200).json({ token, expiresAt });
  } catch (e) {
    if (e?.code === 'EMAIL_REQUIRED' || e?.code === 'PASSWORD_REQUIRED') {
      return res.status(400).json({ error: 'bad_request' });
    }
    if (e?.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'unauthorized' });
    }
    // eslint-disable-next-line no-console
    console.error('LOGIN_INTERNAL_ERROR:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router; 