# TICKET-1002: Define and Implement Core Supabase Schema 🧑‍💻

## Description
This ticket involves defining and implementing the initial database schema in the Supabase PostgreSQL instance. It includes creating tables for user data and configuring Row-Level Security (RLS) policies.

## Requirements

### Tables
The schema must create the following tables:
- `users`
- `writing_style_profiles`
- `memory_banks`

### Field Definitions

#### users
- `id` (`UUID`, PK from Supabase Auth)
- `email` (`VARCHAR`, Unique)
- `name` (`VARCHAR`)
- `created_at` (`TIMESTAMPZ`)

#### writing_style_profiles
- `user_id` (`UUID`, PK/FK to `users.id`)
- `profile_data` (`JSONB`)
- `created_at` (`TIMESTAMPZ`)

#### memory_banks
- `user_id` (`UUID`, PK/FK to `users.id`)
- `data` (`JSONB`)
- `created_at` (`TIMESTAMPZ`)

### Row-Level Security (RLS)
Enable RLS on all three tables and create a policy that only allows a user to `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows where `user_id` is equal to their own authenticated user ID.

## Test Suite Design
1. A **database migration script** that can be run to create the tables.
2. A **verification script** to check for the existence of all tables and the correct RLS policies.

## Acceptance Criteria
1. All three tables exist with the correct schemas.
2. The RLS policies are enabled and correctly prevent unauthorized access. 