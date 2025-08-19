# TICKET-302: Implement Frontend Authentication Service & Token Management 🔑

## Description
Create a testable service module to communicate with backend auth and manage the JWT in local storage.

## Requirements
- File: `/src/services/authService.js`
- Functions: `login(email, password)`, `logout()`, `getToken()`
- Persist token in localStorage; include bearer in API calls

## Acceptance Criteria
- Module exists with specified functions
- `login` calls backend and stores token 