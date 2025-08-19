# TICKET-104: Implement Supabase `WritingStyleProfiles` Table Schema 🖋️

## Description
Create the `writing_style_profiles` table to store AI-generated writing style profiles.

## Requirements
- Table: `writing_style_profiles`
- Fields: `user_id` (FK), `profile_data` (JSONB), timestamps
- RLS: Only owner can access

## Acceptance Criteria
- `writing_style_profiles` table exists with specified fields
- RLS enabled and enforced 