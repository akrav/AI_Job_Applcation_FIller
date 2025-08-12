import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';

const router = Router();

router.get('/me', requireAuth(), async (req, res) => {
  try {
    const admin = initSupabaseAdminFromEnv();
    const { data: userRow, error } = await admin
      .schema('public')
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', req.userId)
      .maybeSingle();
    if (error) return res.status(500).json({ error: 'internal_error' });
    if (!userRow) return res.status(404).json({ error: 'not_found' });
    return res.status(200).json({ id: userRow.id, email: userRow.email, name: userRow.name, created_at: userRow.created_at });
  } catch (e) {
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router; 