import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSupabaseFromEnv } from './supabaseClient.js';
import authRoutes from './routes/auth.js';
import templatesRoutes from './routes/templates.js';
import memoryBankRoutes from './routes/memoryBank.js';
import writingStyleProfileRoutes from './routes/writingStyleProfile.js';
import generateRouter from './routes/generate.js';
import uploadRouter from './routes/upload.js';

// Load .env from current working dir, then fall back to repo root if missing
dotenv.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const rootEnvPath = path.resolve(__dirname, '../../../.env');
	dotenv.config({ path: rootEnvPath });
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/templates', templatesRoutes);
app.use('/api/v1/memory-bank', memoryBankRoutes);
app.use('/api/v1/writing-style-profile', writingStyleProfileRoutes);
app.use('/api/v1/generate', generateRouter);
app.use('/api/v1/files', uploadRouter);

app.get('/api/v1/health', (req, res) => {
	return res.status(200).json({ ok: true });
});

app.get('/api/v1/status', (req, res) => {
	return res.status(200).json({ service: 'user-authentication-service', status: 'ok' });
});

// Initialize Supabase client early to fail fast on misconfig
let supabaseInitError = null;
try {
	initSupabaseFromEnv();
} catch (err) {
	supabaseInitError = err;
	// Do not crash server; expose in /api/v1/health for quick diagnosis
}

app.get('/api/v1/health/supabase', (req, res) => {
	if (supabaseInitError) {
		return res.status(500).json({ ok: false, error: String(supabaseInitError?.message || supabaseInitError) });
	}
	return res.status(200).json({ ok: true });
});

// TEMP: Safe env summary for debugging (remove in prod)
app.get('/api/v1/health/env', (_req, res) => {
	const url = process.env.SUPABASE_URL || '';
	const refMatch = url.match(/^https:\/\/([^.]+)\.supabase\.co/);
	return res.status(200).json({
		path_loaded: '.env (set by test prior to import)',
		supabase_url_ok: Boolean(url),
		project_ref: refMatch ? refMatch[1] : null,
		anon_present: Boolean(process.env.SUPABASE_ANON_KEY),
		service_present: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
		node_env: process.env.NODE_ENV || null
	});
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`user-authentication-service listening on :${port}`);
	});
}

export default app; 