import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
	try {
		const { content = '', placeholders = {} } = req.body || {};
		const userId = req.userId;
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('templates')
			.insert({ user_id: userId, content, placeholders })
			.select('*')
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('templates.create error:', error);
			return res.status(400).json({ error: 'CREATE_FAILED', message: error.message });
		}
		return res.status(201).json(data);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.get('/', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('templates')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });
		if (error) {
			// eslint-disable-next-line no-console
			console.error('templates.list error:', error);
			return res.status(400).json({ error: 'LIST_FAILED', message: error.message });
		}
		return res.status(200).json(data || []);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.put('/:id', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const templateId = Number(req.params.id);
		if (!Number.isFinite(templateId)) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid template id' });
		}
		const { content, placeholders } = req.body || {};
		const admin = initSupabaseAdminFromEnv();
		const { data, error } = await admin
			.schema('public')
			.from('templates')
			.update({ content, placeholders })
			.eq('id', templateId)
			.eq('user_id', userId)
			.select('*')
			.single();
		if (error) {
			// eslint-disable-next-line no-console
			console.error('templates.update error:', error);
			return res.status(400).json({ error: 'UPDATE_FAILED', message: error.message });
		}
		return res.status(200).json(data);
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.delete('/:id', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const templateId = Number(req.params.id);
		if (!Number.isFinite(templateId)) {
			return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid template id' });
		}
		const admin = initSupabaseAdminFromEnv();
		const { error } = await admin
			.schema('public')
			.from('templates')
			.delete()
			.eq('id', templateId)
			.eq('user_id', userId);
		if (error) {
			// eslint-disable-next-line no-console
			console.error('templates.delete error:', error);
			return res.status(400).json({ error: 'DELETE_FAILED', message: error.message });
		}
		return res.status(204).send();
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

export default router; 