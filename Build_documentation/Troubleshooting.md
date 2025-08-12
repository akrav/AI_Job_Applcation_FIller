# Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** August 7, 2025  
**Sprint:** 1 - Foundational Infrastructure & Core User Service

## Overview

Common issues and their resolutions for Supabase configuration, environment variables, and testing.

---

## Node Version / Virtual Environment
- Use `nvm` as the Node virtual environment
- Run `nvm use` at project root to pick up `.nvmrc`
- If not installed, follow nvm installation and re-open terminal
- Ensure `node -v` shows v20+ to avoid Supabase SDK deprecation warnings

---

## Supabase Connection Issues

### "Certificate has expired" or wrong host
- Ensure API host is `https://<project-id>.supabase.co` (no `db.` prefix)

### DNS Resolution Failures
- Verify environment variables and host transformation from `db.` to API host

---

## Environment Variables

### Missing Supabase configuration
- Required: `DB_HOST`, `DB_ANON_KEY`
- Load `.env` from project root or specify path in scripts

### Subdirectory dotenv loading
- Run scripts from project root or set `{ path: '../../.env' }`

---

## API Errors

### Invalid email / weak password
- Use real-looking domains; ensure password length >= 6

### Rate limiting
- Use unique emails in tests; implement backoff

---

## Testing Issues

### Jest import-time env
- Set env vars before importing modules

### Test timeouts
- Increase timeout for network calls (e.g., 10s)

### Email normalization
- Expect lowercase in assertions

---

## Database Connectivity
- Verify `DB_HOST`, `DB_PORT=5432`, `DB_NAME=postgres`, `DB_USER`, `DB_PASSWORD`

---

## Diagnostic Commands
- `nvm use && node -v && npm -v`
- `curl -I https://<project-id>.supabase.co`
- `nslookup <project-id>.supabase.co`

---

## Related Docs
- API Reference
- Project Structure
- Sprint Progress

---

## Common Issues (Sprint 1)

### 1) "Missing Supabase configuration" during tests
- Cause: `.env` not loaded before importing `src/index.js` in ESM tests.
- Fix: Load dotenv first, then dynamically import the app.
```js
// In test file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
({ default: app } = await import('../index.js'));
```

### 2) Integration tests skipping unexpectedly
- Behavior: Some tests are optional and run only with `RUN_SUPABASE_IT=1` and required envs.
- Run explicitly:
```bash
RUN_SUPABASE_IT=1 npm --workspace services/user-authentication-service run test
```

### 3) 500 on registration: "permission denied for table users"
- Cause: `service_role` lacked explicit privileges on `public.users`.
- Fix: Grants added in `database/migrations/001_core_schema.sql`:
```sql
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_banks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.writing_style_profiles TO service_role;
```
- Also ensure admin client uses `schema('public')`:
```js
admin.schema('public').from('users').insert({ id, email })
```

### 4) SIGNUP_FAILED in live tests
- Causes: non-real email domains, rate limits, or auth settings.
- Fixes: use realistic domains (e.g., `@gmail.com`), unique emails (`Date.now()`), and retry later if rate-limited.

### 5) Login returns 401 after registration
- Cause: Email often needs confirmation before password login.
- Fix: Confirm via admin prior to login in tests:
```js
await admin.auth.admin.updateUserById(userId, { email_confirm: true });
```

### 6) Name not saved in `public.users`
- Cause: Request body missing `name` or endpoint not including it.
- Fix: Endpoint accepts `name` and inserts it; send body with `name`:
```http
POST /api/v1/auth/register
{
  "email":"user@example.com",
  "password":"Password123!",
  "name":"Test User"
}
```

### 7) Cross-check script loop error
- Symptom: `syntax error near unexpected token fi`.
- Fix: Close `for ... do` loops with `done`, not `fi`.

### 8) DB refresh script
- Requires `DATABASE_URL` with `sslmode=require` for Supabase:
```bash
DATABASE_URL="postgresql://postgres:***@db.<ref>.supabase.co:5432/postgres?sslmode=require" \
  ./database/scripts/refresh_database.sh
```

### 9) ESM + Jest warning: "Experimental VM Modules"
- Safe to ignore for now. We enable ESM tests via `NODE_OPTIONS=--experimental-vm-modules`.
- Ensure Node 20 via `nvm use`.

### 10) 401 on protected routes despite valid token
- Cause: Missing/bad Authorization header format.
- Fix: Include `Authorization: Bearer <access_token>` using the `access_token` from login. Do not send refresh token or id token.

### 11) Server-side inserts failing due to RLS
- Cause: Using anon client for server-side inserts into `public` tables protected by RLS.
- Fix: Use the admin client created with `SUPABASE_SERVICE_ROLE_KEY` and target the `public` schema:
```js
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
await admin.schema('public').from('users').insert({ id, email });
``` 