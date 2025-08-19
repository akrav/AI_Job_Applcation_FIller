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
- [Sprint 4] TICKET-401: DB Schema for Style Profiles — In Progress
  - Added migration `014_style_profiles.sql` creating `public.style_profiles` with RLS and policies.
  - Updated `Build_documentation/Schemas.md` with new table section.
- [Sprint 4] TICKET-402: DB Schema for Style Artifact Versions — In Progress
  - Added migration `015_style_profile_versions.sql` with RLS and policies; unique index per (style_profile_id, version).
  - Updated `Build_documentation/Schemas.md` with `public.style_profile_versions`.
- [Sprint 4] TICKET-403: DB Schema for Style Documents — In Progress
  - Added migration `016_style_documents.sql` with RLS and own-row policies.
  - Updated `Build_documentation/Schemas.md` with `public.style_documents`.
- [Sprint 4] TICKET-404: DB Schema for Style Exemplars — In Progress
  - Added migration `017_style_exemplars.sql` with FKs to versions and documents, RLS, and policies.
  - Updated `Build_documentation/Schemas.md` with `public.style_exemplars`.
- [Sprint 4] TICKET-405: DB Schema for Style Lexicon — In Progress
  - Added migration `018_style_lexicon.sql` with FK to versions, RLS, and policies.
  - Updated `Build_documentation/Schemas.md` with `public.style_lexicon`.
- [Sprint 4] TICKET-406: DB Schema for Style Run Logs — In Progress
  - Added migration `019_style_runs.sql` with FK to versions, RLS, policies, and indexes.
  - Updated `Build_documentation/Schemas.md` with `public.style_runs`.
- [Sprint 4] TICKET-407: Implement Corpus File Storage — In Progress
  - Added storage module `saveUploadedFile` with validation and Supabase Storage upload; new route `POST /api/v1/files/upload` using multer.
  - Added unit tests for storage function.

## Notes
- Project structure and documentation scaffolding added
- Test and database directories initialized
- Node "virtual environment" standardized via nvm (.nvmrc -> 20)
- DB refresh script used with DATABASE_URL from .env; verify script confirms RLS
- Auth function tests added; comprehensive live tests gated by `RUN_SUPABASE_IT=1`
- Added `002_auth_triggers.sql` to sync `auth.users` insert/delete with `public` tables
- Registration uses UPSERT to merge `name` avoiding trigger race 