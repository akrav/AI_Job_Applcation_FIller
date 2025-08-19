# TICKET-103: Implement Supabase `MemoryBanks` Table Schema 🧠

## Description
Create the `MemoryBanks` table to store personal history and achievements.

## Requirements
- Table: `memory_banks`
- Fields: `user_id` (FK), `data` (JSONB), timestamps
- RLS: Only owner can access

## Acceptance Criteria
- `memory_banks` table exists with specified fields
- RLS enabled and enforced 