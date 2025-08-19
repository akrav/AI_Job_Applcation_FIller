# TICKET-105: Implement Supabase `ApplicationAnswers` Table Schema & `pgvector` 📝

## Description
Create the `application_answers` table to store past questions/answers with vector embeddings.

## Requirements
- Table: `application_answers`
- Fields: `user_id` (FK), `question` (TEXT), `answer` (TEXT), `vector_embedding` (VECTOR)
- Enable `pgvector` extension
- RLS: Only owner can access

## Acceptance Criteria
- Table created with vector column
- `pgvector` enabled
- RLS enforced 