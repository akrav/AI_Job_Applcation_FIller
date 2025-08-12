import { createClient } from '@supabase/supabase-js';

export function requireAuth() {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization || '';
      const [, token] = auth.split(' ');
      if (!token) return res.status(401).json({ error: 'unauthorized' });

      const supabaseUrl = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) return res.status(500).json({ error: 'server_misconfigured' });

      const anon = createClient(supabaseUrl, anonKey);
      const { data, error } = await anon.auth.getUser(token);
      if (error || !data?.user?.id) return res.status(401).json({ error: 'unauthorized' });
      req.userId = data.user.id;
      return next();
    } catch (e) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  };
} 