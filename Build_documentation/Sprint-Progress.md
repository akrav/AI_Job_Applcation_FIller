# Sprint Progress

**Version:** 1.0  
**Last Updated:** August 7, 2025  
**Sprint:** 1 - Foundational Infrastructure & Core User Service

## Tickets Status

| Ticket | Title | Status | Notes |
|--------|-------|--------|-------|
| TICKET-1001 | Initialise Node.js Project Structure & Supabase Client | Completed | Monorepo + service scaffolded; Supabase init; ESM Jest tests passing; Node pinned to v20 via .nvmrc |
| TICKET-1002 | Define and Implement Core Supabase Schema | Completed | Applied `001_core_schema.sql`; created `users`, `writing_style_profiles`, `memory_banks`; RLS enabled + own-row policies; verification passed |
| TICKET-1003 | Implement createUserInSupabase Function | Completed | Function implemented with input validation and duplicate email normalization; unit tests (success + duplicate) passing |
| TICKET-1004 | Implement signInWithSupabase Function | Completed | Function implemented and used by `/auth/login`; unit + live tests passing |
| TICKET-1005 | Implement User Registration Endpoint | Completed | `/auth/register` implemented; upserts into public tables; service_role grants; live IT passing |
| TICKET-1006 | Implement User Login Endpoint | Completed | `/auth/login` implemented; returns JWT + expiry; live IT passing |
| TICKET-1007 | Implement User Profile Retrieval Endpoint | Completed | `/users/me` protected; returns id, email, name; live IT passing |
| TICKET-1008 | Implement Initial Profile Onboarding Endpoint | Completed | `/profile/onboard` protected; updates `memory_banks.data`; live IT passing |

## Notes
- Project structure and documentation scaffolding added
- Test and database directories initialized
- Node "virtual environment" standardized via nvm (.nvmrc -> 20)
- DB refresh script used with DATABASE_URL from .env; verify script confirms RLS
- Auth function tests added; comprehensive live tests gated by `RUN_SUPABASE_IT=1`
- Added `002_auth_triggers.sql` to sync `auth.users` insert/delete with `public` tables
- Registration uses UPSERT to merge `name` avoiding trigger race 