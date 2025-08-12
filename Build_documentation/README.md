# Build Documentation

This folder centralizes all developer-facing documentation to implement and validate tickets end-to-end.

## Contents
- `API-Reference.md` — Endpoint and function specifications
- `Schemas.md` — Database schema and RLS policies
- `Sprint-Progress.md` — Status of tickets and notes
- `Troubleshooting.md` — Known issues and fixes
- `Project Structure Documentation.md` — Repository structure
- `Best-Practices.md` — Coding, testing, and workflow guidance

## Recommended Flow (per ticket)
1. Review `Best-Practices.md`
2. Check interfaces in `API-Reference.md`
3. If schema changes are needed, update `Schemas.md` and migrations
4. Implement code + tests
5. Update ticket doc and `Sprint-Progress.md`
6. Run `tests/run_cross_checks.sh` and fix any failures 