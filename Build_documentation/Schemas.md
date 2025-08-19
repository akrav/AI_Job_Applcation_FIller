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

### public.style_profiles
- `id` UUID PK
- `user_id` UUID FK → `auth.users.id`
- `name` VARCHAR
- `status` VARCHAR
- `active_version_id` UUID (nullable)
- `created_at` TIMESTAMPTZ
- `updated_at` TIMESTAMPTZ

### public.style_profile_versions
- `id` UUID PK
- `style_profile_id` UUID FK → `public.style_profiles.id`
- `version` INTEGER (unique per `style_profile_id`)
- `kernel_json` JSONB
- `thresholds_json` JSONB
- `created_at` TIMESTAMPTZ

### public.style_documents
- `id` UUID PK
- `style_profile_id` UUID FK → `public.style_profiles.id`
- `file_name` TEXT
- `mime_type` TEXT
- `bytes_url` TEXT
- `text_chars` TEXT
- `created_at` TIMESTAMPTZ

### public.style_exemplars
- `id` UUID PK
- `style_profile_version_id` UUID FK → `public.style_profile_versions.id`
- `text` TEXT
- `word_count` INTEGER
- `source_document_id` UUID FK → `public.style_documents.id` (nullable)
- `created_at` TIMESTAMPTZ

### public.style_lexicon
- `id` UUID PK
- `style_profile_version_id` UUID FK → `public.style_profile_versions.id`
- `preferred_terms` JSONB
- `banned_terms` JSONB
- `synonyms_map` JSONB
- `created_at` TIMESTAMPTZ

### public.style_runs
- `id` UUID PK
- `style_profile_version_id` UUID FK → `public.style_profile_versions.id`
- `task` TEXT
- `input_json` JSONB
- `output_text` TEXT
- `score` NUMERIC(4,3)
- `passed` BOOLEAN
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