# TICKET-1007: Implement User Profile Retrieval Endpoint ℹ️

## Description
Create the protected endpoint that allows a logged-in user to retrieve their own basic profile information. This endpoint will serve as the first test of the RLS policies and JWT validation.

## Requirements

### Endpoint
`GET /api/v1/users/me`

### Protection
The endpoint must require a valid JWT in the `Authorization` header.

### Success Response
`200 OK` with a JSON body containing the user's `name` and other basic data from the `users` table.

## Test Suite Design
1. An **integration test** for a **valid JWT** that asserts a `200` status and the correct user data is returned.
2. An **integration test** for an **invalid or missing JWT** that asserts a `401 Unauthorized` status.
3. A **cross-user test** that attempts to retrieve another user's data (to check RLS) and asserts a `401` or `404` status.

## Acceptance Criteria
1. An authenticated request to the endpoint returns the correct user data.
2. An unauthenticated request fails with a `401` error.
3. A request with a valid token from User A cannot retrieve data belonging to User B. 