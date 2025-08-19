# API Reference

**Version:** 1.1  
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
  "password": "string",
  "name": "string (optional)"
}
```
- **Responses:**
  - 201 Created `{ "message": "registered" }`
  - 400 Bad Request
  - 409 Conflict (duplicate email)
- **Notes:**
  - Uses upsert for `public.users` and `public.memory_banks` to avoid races with auth triggers.

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
  - 200 OK `{ "token": "...", "expiresAt": "ISO-8601" }`
  - 400 Bad Request
  - 401 Unauthorized

### GET /api/v1/users/me
- **Auth:** `Authorization: Bearer <access_token>`
- **Description:** Returns authenticated user's profile data.
- **Responses:**
  - 200 OK `{ id, email, name, created_at }`
  - 401 Unauthorized
  - 404 Not Found (no row for user)

### POST /api/v1/profile/onboard
- **Auth:** `Authorization: Bearer <access_token>`
- **Description:** Saves initial MemoryBanks data for authenticated user.
- **Body:** `{ ...JSON payload... }`
- **Responses:**
  - 200 OK `{ "message": "saved" }`
  - 401 Unauthorized
  - 404 Not Found

### POST /api/v1/files/upload
- **Auth:** `Authorization: Bearer <access_token>`
- **Description:** Uploads a corpus file (PDF, DOCX, TXT, MD) to Supabase Storage.
- **Form-Data:**
  - `file` (single file)
- **Constraints:** Max 15MB; allowed types: application/pdf, docx, text/plain, text/markdown
- **Responses:**
  - 201 Created `{ "bytes_url": "https://...", "mime_type": "text/plain", "size": 1234, "path": "bucket/path" }`
  - 400 Bad Request
  - 401 Unauthorized

---

## Conventions
- **Versioning:** All endpoints prefixed with `/api/v1/`
- **Auth:** JWT in `Authorization` header. Use `access_token` from login.
- **Errors:** JSON with `error` and optional `message` fields

---

## References
- Supabase Auth JS SDK
- Project Architecture & Implementation Plan 