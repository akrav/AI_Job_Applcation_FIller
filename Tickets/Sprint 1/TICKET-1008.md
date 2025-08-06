# TICKET-1008: Implement Initial Profile Onboarding Endpoint 📝

## Description
Create the protected endpoint that allows a newly registered user to save their initial `MemoryBanks` data during the onboarding process. This will be a simple, one-time data save.

## Requirements

### Endpoint
`POST /api/v1/profile/onboard`

### Protection
The endpoint must require a valid JWT.

### Request Body
A JSON object containing the initial profile data (e.g., `{"work_experience": "...", "skills": "..."}`).

### Success Response
`200 OK` with a success message.

### Logic
The endpoint will update the `data` column of the `memory_banks` table for the authenticated user.

## Test Suite Design
1. An **integration test** for a **successful data save** that asserts a `200` status and verifies the data was correctly stored in the `memory_banks` table via a direct database query.
2. An **integration test** for a **missing JWT** that asserts a `401 Unauthorized` status.

## Acceptance Criteria
1. An authenticated user can successfully save their initial profile data.
2. The saved data is correctly persisted in the `memory_banks` table.
3. The endpoint is protected and rejects unauthorized requests. 