# TICKET-102: Implement Supabase `Templates` Table Schema 📝

## Description
Create the `Templates` table to store cover letter templates and placeholders.

## Requirements
- Table: `templates`
- Fields: `user_id` (FK), `content` (TEXT), `placeholders` (JSONB), timestamps
- RLS: Only owner can access their templates

## Acceptance Criteria
- `templates` table exists with specified fields
- RLS enabled and enforced 