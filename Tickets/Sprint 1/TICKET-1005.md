# TICKET-1005: Implement User Registration Endpoint ✍️

## Description
Create the public-facing API endpoint for new user registration. This endpoint will orchestrate the creation of a user in Supabase Auth and then populate the corresponding records in the `users` and `memory_banks` tables.

## Requirements

### Endpoint
`POST /api/v1/auth/register`

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Success Response
`201 Created` with a success message.

### Logic
1. Call the `createUserInSupabase` function.
2. If successful, use the returned user ID (`id`) to create a new record in the `users` and `memory_banks` tables.

## Test Suite Design
1. An **integration test** for a **successful registration** that asserts a `201` status and verifies the user exists in Supabase Auth and the `users` and `memory_banks` tables.
2. An **integration test** for a **duplicate email** that asserts a `409 Conflict` status.
3. An **integration test** for **invalid input** (e.g., missing email) that asserts a `400 Bad Request` status.

## Acceptance Criteria
1. A successful call creates a user in Supabase and the correct tables in the app database.
2. An attempt to register with a duplicate email returns a `409` status. 