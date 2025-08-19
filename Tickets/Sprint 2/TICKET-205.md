# TICKET-205: Implement Vector Search Function in Supabase 🔎

## Description
Perform similarity search in Supabase vector DB to retrieve relevant answers.

## Requirements
- Function: `findSimilarLines(queryEmbedding: number[])`
- Perform nearest-neighbor search in `application_answers.vector_embedding`

## Acceptance Criteria
- Successfully retrieves relevant answers based on vector similarity 