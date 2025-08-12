# TICKET-2002: Implement a Generic RBAC Middleware 🛡️

## Description
Create a reusable middleware `rbacMiddleware(allowedRoles)` to restrict access based on a user's role.

## Requirements
- Function: `rbacMiddleware(allowedRoles: string[])`
- Extract JWT, decode to user_id, fetch `account_type` from `users`
- Allow if role ∈ allowedRoles; else 403

## Test Suite Design
- Allowed role → next() called
- Disallowed role → 403
- Missing token → 401

## Acceptance Criteria
- Correctly allows/denies based on role
- Handles missing/invalid token with 401 