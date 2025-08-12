# Database Schema Documentation

**Version:** 1.1  
**Last Updated:** August 7, 2025  
**Sprint:** 1 - Foundational Infrastructure & Core User Service  
**Tickets:** TICKET-1002, TICKET-1005, TICKET-1008

## Overview

Core tables to support authentication-linked user data and onboarding data storage. Hosted on Supabase.

---

## Schemas
- `auth` (managed by Supabase)
- `public` (application tables)

### public.users
- `id` UUID PK (references `auth.users.id`)
- `email` TEXT UNIQUE
- `name` TEXT
- `created_at` TIMESTAMPTZ

### public.writing_style_profiles
- `user_id` UUID PK/FK → `public.users.id`
- `profile_data` JSONB
- `created_at` TIMESTAMPTZ

### public.memory_banks
- `user_id` UUID PK/FK → `public.users.id`
- `data` JSONB
- `created_at` TIMESTAMPTZ

---

## RLS Policies
- Enable RLS on all three tables
- Policy: allow SELECT/INSERT/UPDATE/DELETE when `user_id = auth.uid()` (or `id = auth.uid()` for `users`)

---

## Triggers & Sync (002_auth_triggers.sql)
- `public.handle_new_auth_user`: on insert into `auth.users`, seed `public.users` and `public.memory_banks` (ON CONFLICT DO NOTHING)
- `public.handle_deleted_auth_user`: on delete from `auth.users`, delete matching `public.users` (cascade removes dependents)
- Triggers:
  - `on_auth_user_created` AFTER INSERT ON `auth.users`
  - `on_auth_user_deleted` AFTER DELETE ON `auth.users`

---

## Privileges (001_core_schema.sql)
- Grants for `service_role`:
  - `USAGE` on schema `public`
  - `SELECT, INSERT, UPDATE, DELETE` on `public.users`, `public.memory_banks`, `public.writing_style_profiles`

---

## Verification
- Verification script checks table existence and RLS enabled
- Live tests confirm trigger seeding and cascade deletes 