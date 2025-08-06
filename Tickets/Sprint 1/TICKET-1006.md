# TICKET-1006: Implement User Login Endpoint ➡️

## Description
Create the public-facing API endpoint for user login. This endpoint will use the `signInWithSupabase` function and return a JWT that the client can use for future requests.

## Requirements

### Endpoint
`POST /api/v1/auth/login`

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Success Response
`200 OK` with a JSON body containing the JWT (`{ "token": "..." }`).

### Logic
1. Call the `signInWithSupabase` function.
2. If successful, extract the JWT from the session object and return it.

## Test Suite Design
1. An **integration test** for a **successful login** that asserts a `200` status and a valid JWT is returned.
2. An **integration test** for **invalid credentials** that asserts a `401 Unauthorized` status.

## Acceptance Criteria
1. A successful login returns a `200 OK` with a valid JWT.
2. A login attempt with invalid credentials returns a `401 Unauthorized` error. 