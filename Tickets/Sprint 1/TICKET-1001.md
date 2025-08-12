# TICKET-1001: Initialise Node.js Project Structure & Supabase Client 🛠️

## Description
This ticket covers the initial setup of the Node.js project. It involves creating the monorepo structure, installing foundational libraries like Express.js, and configuring the Supabase JavaScript client for connection.

## Requirements

### Project Structure
A modular monorepo structure should be established to house different services.
```
/project-root
├── /services
│   ├── /user-authentication-service
│   └── ... (other future services)
├── /packages
│   └── /common (shared utilities, types)
└── package.json
```

### Dependencies
- Install `express`
- Install `dotenv`
- Install `@supabase/supabase-js` client library

### Supabase Config
Configure the Supabase client with the URL and API key from a `.env` file.

## Test Suite Design
- A **unit test** that verifies the Supabase client is successfully initialized and has a valid URL and key.

## Acceptance Criteria
1. The Node.js application can be started without errors.
2. The project directory structure is in place.
3. The Supabase client is configured and can connect to the database.

---

## Implementation Notes (Completed)
- Created monorepo with npm workspaces and `.nvmrc` set to Node 20 (use `nvm use`)
- Added `services/user-authentication-service` with Express, security middleware, health endpoints
- Implemented `src/supabaseClient.js` with `initSupabaseFromEnv()` and error on missing config
- ESM-friendly Jest setup; added `supabase-init.test.js` covering missing/valid env cases
- `.gitignore` updated to ignore `.env` and common artifacts

## How to Run
- Install deps: `npm install`
- Tests: `npm test`
- Dev server: `npm run dev`
- Cross checks: `./tests/run_cross_checks.sh` 