# AI Me Apply

A backend-first MVP leveraging Supabase for auth, storage, and Postgres. This repository includes tickets, build documentation, tests scaffolding, and database scripts.

## Prerequisites
- Node.js >= 18 (recommend `nvm`)
- npm >= 9
- psql (PostgreSQL client)
- Supabase account + project

## Getting Started

### 1) Clone
```bash
git clone https://github.com/your-username/AI_Job_Applcation_FIller.git
cd AI_Job_Applcation_FIller
```

### 2) Create environment
- Copy `.env.example` to `.env` and fill values from your Supabase project
```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` — `https://<project-ref>.supabase.co`
- `SUPABASE_ANON_KEY` — Project API anon key (client-safe)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-only)
- `DATABASE_URL` — Postgres connection string (Server Settings → Database)
- `JWT_SECRET` — Long random secret if you use custom JWTs

Optional:
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

### 3) Supabase setup
- In the Supabase dashboard:
  - Create a new project
  - Copy API keys to `.env`
  - Copy Postgres connection string to `.env` as `DATABASE_URL`

### 4) Install dependencies (future)
As services are added, install workspaces via npm. For now, the repo contains docs, tests scaffolding, and scripts.

### 5) Database migration (Sprint 1 schema)
Use the provided scripts against your Supabase Postgres:
```bash
# Recreate public schema, apply migrations, verify
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require" \
  ./database/scripts/refresh_database.sh
```
This will:
- Drop and recreate `public` schema
- Apply `database/migrations/001_core_schema.sql`
- Run `database/scripts/verify_schema.sql`

### 6) Cross checks
```bash
./tests/run_cross_checks.sh
```
Verifies tickets/docs/scripts presence and naming.

## Working a Ticket (Definition of Done)
1. Open the ticket file: `Tickets/Sprint 1/TICKET-####.md`
2. Review engineering guidelines: `Build_documentation/Best-Practices.md`
3. If schema changes are needed: update `Build_documentation/Schemas.md` and add a migration in `database/migrations`
4. Implement code + tests
5. Update ticket status and acceptance criteria in the ticket file
6. Update `Build_documentation/Sprint-Progress.md`
7. Run cross-checks: `tests/run_cross_checks.sh`
8. If DB changes: re-run `database/scripts/refresh_database.sh`

## Key Documentation
- Build documentation: `Build_documentation/README.md`
  - `Project Structure Documentation.md`
  - `API-Reference.md`
  - `Schemas.md`
  - `Sprint-Progress.md`
  - `Troubleshooting.md`
  - `Best-Practices.md`
- Tickets: `Tickets/Sprint 1/`
- Tests scaffolding: `tests/`
- Database: `database/`

## Supabase Notes
- RLS policies are enabled for Sprint 1 tables
- Use the Service Role key only on the server side; never expose publicly
- All scripts use `DATABASE_URL` (SSL required)

## Running Sprints Step-by-Step
- For each ticket:
  - Follow the sequence described in the ticket
  - Keep docs updated as you deliver functionality
  - Ensure tests and cross checks pass before moving on

## UI Usage (coming soon)
- Frontend/UI instructions will be added as Sprint 2+ introduces the web portal.

## Troubleshooting
See `Build_documentation/Troubleshooting.md` for common issues (env, DNS, rate limits, testing).