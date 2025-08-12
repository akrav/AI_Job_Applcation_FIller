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