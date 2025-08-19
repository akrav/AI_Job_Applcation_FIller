import { Router } from 'express';
import { initSupabaseFromEnv, initSupabaseAdminFromEnv } from '../supabaseClient.js';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res.status(400).json({ error: 'MISSING_FIELDS', message: 'email and password are required' });
		}

		const supabase = initSupabaseFromEnv();

		let admin = null;
		try {
			admin = initSupabaseAdminFromEnv();
		} catch (_err) {
			// optional: service role not present in env during tests; proceed without admin checks
		}

		if (admin) {
			const { data: existingList, error: listErr } = await admin.auth.admin.listUsers({ email });
			if (!listErr) {
				const existing = existingList.users.find(u => u.email === email);
				if (existing) return res.status(200).json({ userId: existing.id, existed: true });
			}
		}

		let { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			// eslint-disable-next-line no-console
			console.log('[SIGNUP_ERROR]', {
				status: error.status, code: error.code, msg: error.message,
				env: {
					url_ok: Boolean(process.env.SUPABASE_URL),
					anon_set: Boolean(process.env.SUPABASE_ANON_KEY),
					service_set: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
				}
			});
			// Fallbacks with admin client: on 429 (rate limit) or 500, try to confirm existence or create via admin
			if (admin && (error.status === 429 || error.status === 500)) {
				// Check if already exists
				try {
					const { data: afterList } = await admin.auth.admin.listUsers({ email });
					const found = afterList?.users?.find(u => u.email === email);
					if (found) return res.status(200).json({ userId: found.id, existed: true });
				} catch (_e) { /* ignore */ }
				// Attempt to create via admin (bypasses public rate limits)
				try {
					const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
					const id = created?.data?.user?.id;
					if (id) return res.status(201).json({ userId: id });
				} catch (_e) {
					// As a last resort, re-list
					try {
						const { data: afterList2 } = await admin.auth.admin.listUsers({ email });
						const found2 = afterList2?.users?.find(u => u.email === email);
						if (found2) return res.status(200).json({ userId: found2.id, existed: true });
					} catch (__e) { /* ignore */ }
				}
			}
			return res
				.status(error.status || 400)
				.json({ error: 'SIGNUP_FAILED', code: error.code, message: error.message });
		}

		return res.status(201).json({ userId: data.user?.id });
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res.status(400).json({ error: 'MISSING_FIELDS', message: 'email and password are required' });
		}

		const supabase = initSupabaseFromEnv();
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			return res.status(401).json({ error: 'INVALID_CREDENTIALS', code: error.code, message: error.message });
		}

		const session = data.session;
		return res.status(200).json({
			access_token: session?.access_token,
			expires_in: session?.expires_in,
			token_type: session?.token_type,
			userId: data.user?.id
		});
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

export default router; 