# TICKET-1004: Implement `signInWithSupabase` Function 🔑

## Description
This ticket covers the implementation of a low-level function that authenticates a user with Supabase. It takes a user's credentials and returns a session object with a JWT.

## Requirements

### Function Signature
`signInWithSupabase(email, password)`

### Logic
Use the Supabase client to call `supabase.auth.signInWithPassword()`.

### Error Handling
The function must handle success and error responses, such as invalid credentials.

## Test Suite Design
1. A **unit test** for the function with **valid credentials** that asserts a session object is returned.
2. A **unit test** for the function with **invalid credentials** that asserts a specific error is thrown.

## Acceptance Criteria
1. The function successfully authenticates a user and returns a session object.
2. The function correctly handles invalid credentials by throwing a catchable error. 