# TICKET-1003: Implement `createUserInSupabase` Function ➕

## Description
This ticket covers the implementation of a reusable function that communicates with the Supabase Auth API to create a new user. This is a low-level function that will be used by the registration endpoint.

## Requirements

### Function Signature
`createUserInSupabase(email, password)`

### Logic
Use the Supabase client to call `supabase.auth.signUp()`.

### Error Handling
The function must catch and re-throw specific errors, such as a "user with this email already exists" error.

## Test Suite Design
1. A **unit test** for the function with a **new email** that asserts a user is created in Supabase.
2. A **unit test** for the function with an **existing email** that asserts a specific error is thrown.

## Acceptance Criteria
1. The function successfully creates a new user in Supabase Auth.
2. The function correctly handles a duplicate email by throwing a catchable error.

---

## Implementation Notes (Completed)
- Implemented `src/auth/createUserInSupabase.js` with input validation and duplicate email normalization
- Added unit tests in `src/__tests__/createUserInSupabase.test.js` (success + duplicate email)

## How to Run
- Tests: `npm test` (workspace: user-authentication-service) 