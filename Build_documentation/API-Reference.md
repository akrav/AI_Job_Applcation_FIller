# API Reference

**Version:** 1.0  
**Last Updated:** August 7, 2025  
**Scope:** Sprint 1 - Foundational Infrastructure & Core User Service

## Low-Level Functions

### createUserInSupabase(email, password)
- **Description:** Creates a user via Supabase Auth.
- **Inputs:**
  - `email` string (valid email)
  - `password` string (>= 6 chars)
- **Returns:** `{ userId: string, email: string }`
- **Errors:**
  - `EMAIL_ALREADY_EXISTS`
  - `INVALID_EMAIL`
  - `WEAK_PASSWORD`

### signInWithSupabase(email, password)
- **Description:** Authenticates user and returns a session with JWT.
- **Inputs:** `email`, `password`
- **Returns:** `{ token: string, expiresAt: string }`
- **Errors:** `INVALID_CREDENTIALS`, `RATE_LIMITED`

---

## REST API Endpoints

### POST /api/v1/auth/register
- **Description:** Registers a new user and initializes profile records.
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Responses:**
  - 201 Created `{ message: "registered" }`
  - 400 Bad Request
  - 409 Conflict (duplicate email)

### POST /api/v1/auth/login
- **Description:** Authenticates user and returns JWT.
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Responses:**
  - 200 OK `{ token: "..." }`
  - 401 Unauthorized

### GET /api/v1/users/me
- **Description:** Returns authenticated user's profile data.
- **Headers:** `Authorization: Bearer <token>`
- **Responses:**
  - 200 OK `{ name: string, ... }`
  - 401 Unauthorized

### POST /api/v1/profile/onboard
- **Description:** Saves initial MemoryBanks data for authenticated user.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ ...JSON payload... }`
- **Responses:**
  - 200 OK `{ message: "saved" }`
  - 401 Unauthorized

---

## Conventions
- **Versioning:** All endpoints prefixed with `/api/v1/`
- **Auth:** JWT in `Authorization` header
- **Errors:** JSON with `error` and `message` fields

---

## References
- Supabase Auth JS SDK
- Project Architecture & Implementation Plan 