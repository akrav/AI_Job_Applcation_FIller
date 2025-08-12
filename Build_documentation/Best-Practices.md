# Engineering Best Practices

**Version:** 1.0  
**Last Updated:** August 7, 2025  
**Scope:** Applies to all tickets

## General
- Prefer clarity over cleverness; write readable, self-documenting code
- Use explicit, descriptive names (functions = verbs, variables = nouns)
- Small, composable modules with single responsibility
- Early returns, guard clauses; avoid deep nesting

## Types & Interfaces
- Add explicit function signatures for exported APIs
- Avoid `any`; prefer precise types

## Error Handling
- Validate inputs at boundaries (API handlers, public functions)
- Throw typed/application errors with actionable messages
- Never swallow errors; log context with correlation IDs where applicable

## Logging
- Use structured logs (level, message, context)
- No PII in logs; scrub tokens and secrets

## Security
- Environment variables via `.env` (never commit secrets)
- Enforce JWT on protected routes; verify audience/issuer when available
- Enable Supabase RLS; least-privilege data access

## Testing
- Unit tests for pure logic (happy + edge cases)
- Integration tests for endpoints and Supabase interactions
- Cross-ticket tests to keep system consistent
- Target 80%+ coverage for new code
- Keep tests deterministic (unique emails, seeded data)

## Documentation
- Update ticket `.md` with decisions and acceptance criteria
- Keep API Reference and Schemas in `Build_documentation` in sync
- Record issues and fixes in Troubleshooting

## Git Workflow
- Small commits scoped to one concern
- Meaningful messages: imperative mood (e.g., "Add login endpoint")
- Link commits to tickets when possible

## Performance & Reliability
- Timeouts for all external calls (LLM, scraping, Supabase)
- Exponential backoff for transient errors; no retries for user errors
- Pagination for list endpoints; input size limits on uploads

## Definition of Done (per Ticket)
- Code implemented with best practices above
- Tests written and passing (unit/integration as applicable)
- Docs updated: ticket, API, Schemas (if applicable)
- Cross-ticket suite passes
- Lint/format run; no TypeScript/ESLint errors 