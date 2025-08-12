# TICKET-1003 Tests

## Checklist
- [x] Unit tests for createUserInSupabase (new + duplicate email)
- [x] Optional integration test: real user creation + admin verification + cleanup
- [x] Ticket document exists and defines error semantics

## Integration Test (optional)
- Enable and run:
```
RUN_SUPABASE_IT=1 npm --workspace services/user-authentication-service run test
```
- Requires: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env` 