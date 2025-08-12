# Project Structure Documentation

**Version:** 1.1  
**Last Updated:** August 7, 2025  
**Sprint:** 1 - Foundational Infrastructure & Core User Service

## Overview

This document maintains a comprehensive record of the AI Me Apply project structure, documenting all folders and files as they are added during development. The project follows a monorepo-ready structure to support future services while starting with a backend-focused MVP using Supabase.

**Related Documentation:**
- [Sprint Progress](./Sprint-Progress.md)
- [API Reference](./API-Reference.md)
- [Troubleshooting](./Troubleshooting.md)
- [Database Schema](./Schemas.md)

---

## Root Directory Structure

```
/AI_Job_Applcation_FIller (project-root)
├── /Build_documentation/        # Build and development documentation
│   ├── API-Reference.md         # API function and endpoint reference
│   ├── Schemas.md               # Database schema documentation
│   ├── Sprint-Progress.md       # Sprint progress tracking
│   ├── Troubleshooting.md       # Issue resolution guide
│   └── Project Structure Documentation.md # Project structure documentation (this file)
├── /Documentation/              # Architecture, PRD, Implementation Plan
├── /Tickets/                    # Sprint planning and tickets
│   └── /Sprint 1/               # Sprint 1 tickets
├── /tests/                      # Tests and configuration
│   ├── /config/                 # Test config (jest, setup)
│   └── /suites/                 # Organized test suites
│       └── /sprint-1/           # Sprint 1 cross-ticket tests
├── /database/                   # Database migrations and scripts
│   ├── /migrations/             # SQL/JS migrations
│   │   ├── 001_core_schema.sql
│   │   └── 002_auth_triggers.sql
│   └── /scripts/                # Admin/refresh scripts
├── /services/                   # Backend services (current & future)
│   └── /user-authentication-service/
│       ├── src/
│       │   ├── auth/                    # Low-level auth functions
│       │   ├── middleware/              # `requireAuth`
│       │   ├── routes/                  # `auth`, `users`, `profile`
│       │   ├── __tests__/               # Unit + optional integration tests
│       │   └── index.js                 # Express app
│       └── package.json                 # Service scripts and deps
├── README.md                    # Project setup and usage guide
└── .gitignore                   # Git exclusion patterns
```

---

## Tests Directory
- Live tests are gated by `RUN_SUPABASE_IT=1` and load `.env` before importing the app.

---

## Database Directory
- Migrations now include auth→public sync triggers and cascade deletes via `002_auth_triggers.sql`.
- Grants for `service_role` added in `001_core_schema.sql`. 