# Database Schema Documentation

**Version:** 1.0  
**Last Updated:** August 7, 2025  
**Sprint:** 1 - Foundational Infrastructure & Core User Service  
**Tickets:** TICKET-1002

## Overview

Core tables to support authentication-linked user data and onboarding data storage. Hosted on Supabase.

---

## Schemas
- `auth` (managed by Supabase)
- `public` (application tables)

### public.users
- `id` UUID PK (references `auth.users.id`)
- `email` VARCHAR UNIQUE
- `name` VARCHAR
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
- Policy: allow SELECT/INSERT/UPDATE/DELETE when `user_id = auth.uid()`

---

## Migration Notes
- Create tables in a single transactional migration
- Add RLS enable + policies after table creation

---

## Verification
- Verification script checks table existence and RLS enabled 