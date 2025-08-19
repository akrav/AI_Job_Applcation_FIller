# TICKET-107: Implement Profile Initialisation Logic on Registration 🧑‍💻

## Description
Implement a trigger/webhook to create initial records in `MemoryBanks`, `Templates`, and `WritingStyleProfiles` when a new user registers.

## Requirements
- Trigger on new user creation
- Create empty records in each table with `user_id`

## Acceptance Criteria
- New user auto-seeded across all relevant tables 