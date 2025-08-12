import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';

const router = Router();

router.post('/onboard', requireAuth(), async (req, res) => {
  try {
    const admin = initSupabaseAdminFromEnv();
    const payload = req.body || {};

    const { data, error } = await admin
      .schema('public')
      .from('memory_banks')
      .update({ data: payload })
      .eq('user_id', req.userId)
      .select('*')
      .maybeSingle();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('ONBOARD_UPDATE_FAILED:', error);
      return res.status(500).json({ error: 'update_failed' });
    }
    if (!data) return res.status(404).json({ error: 'not_found' });

    return res.status(200).json({ message: 'saved' });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('ONBOARD_INTERNAL_ERROR:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router; 