import { initSupabaseFromEnv } from '../supabaseClient.js';

export async function requireAuth(req, res, next) {
	try {
		const auth = req.header('authorization') || req.header('Authorization') || '';
		const match = auth.match(/^Bearer\s+(.+)$/i);
		if (!match) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing Bearer token' });
		const token = match[1];
		const supabase = initSupabaseFromEnv();
		const { data, error } = await supabase.auth.getUser(token);
		if (error || !data?.user?.id) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
		req.userId = data.user.id;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token validation failed' });
	}
} 