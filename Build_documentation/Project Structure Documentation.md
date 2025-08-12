# Project Structure Documentation

**Version:** 1.0  
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
│   └── /scripts/                # Admin/refresh scripts
├── README.md                    # Project setup and usage guide
└── .gitignore                   # Git exclusion patterns
```

---

## Tickets Directory

The `/Tickets/` directory contains sprint planning and individual ticket documents. For Sprint 1, each ticket document is stored as `TICKET-####.md`.

- `TICKET-1001.md` - Node.js structure & Supabase client setup
- `TICKET-1002.md` - Core Supabase schema
- `TICKET-1003.md` - createUserInSupabase function
- `TICKET-1004.md` - signInWithSupabase function
- `TICKET-1005.md` - User registration endpoint
- `TICKET-1006.md` - User login endpoint
- `TICKET-1007.md` - User profile retrieval endpoint
- `TICKET-1008.md` - Initial profile onboarding endpoint

---

## Tests Directory

```
/tests/
├── /config/
│   └── README.md                 # Test config overview
└── /suites/
    └── /sprint-1/
        ├── cross-ticket.test.md  # Cross-ticket verification script (doc-based)
        └── README.md             # Sprint 1 test suite overview
```

- **Unit Tests (per ticket):** Added gradually alongside implementation.
- **Cross-Ticket Tests:** Quick checks to ensure critical artifacts exist and remain consistent.

---

## Database Directory

- `/database/migrations/` - Migration files to create/update schema
- `/database/scripts/` - Administrative scripts (refresh, seed, verify)

Scripts include:
- `refresh_database.sh` - Recreates schema and applies migrations
- `verify_schema.sql` - Validates required tables and policies

---

## Version History

| Version | Date | Sprint | Changes |
|---------|------|--------|---------|
| 1.0 | Aug 7, 2025 | Sprint 1 | Initial structure docs, folders, and test/db scaffolding | 