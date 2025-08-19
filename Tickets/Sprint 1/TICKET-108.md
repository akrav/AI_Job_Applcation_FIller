# TICKET-108: Implement User Login Endpoint 🔑

## Description
Create the API endpoint for user login using Supabase.

## Requirements
- Endpoint: `POST /api/v1/auth/login`
- Logic: `supabase.auth.signInWithPassword()` and return JWT

## Acceptance Criteria
- Existing user can log in and receive a JWT
- Proper error for invalid credentials 