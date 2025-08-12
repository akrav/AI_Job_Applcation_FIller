import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { initSupabaseFromEnv } from './supabaseClient.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

// Supabase client init (throws if missing)
export const supabase = (() => {
  try {
    return initSupabaseFromEnv();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    if (process.env.NODE_ENV !== 'test') process.exit(1);
    return null;
  }
})();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/v1/status', (req, res) => {
  res.status(200).json({ service: 'user-authentication-service', version: '0.1.0' });
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`user-authentication-service listening on ${PORT}`);
  });
}

export default app; 