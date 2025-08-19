### TICKET-401: DB Schema for Style Profiles 📝

**Description**
Create the core database schema for `style_profiles`, which will store a user's writing style configuration. This is the top-level entity that will contain all subsequent style-related data.

**Requirements**
- Table: `style_profiles(id UUID, user_id UUID FK, name VARCHAR, status VARCHAR, created_at TIMESTAMPZ, updated_at TIMESTAMPZ, active_version_id UUID FK)`

**Acceptance Criteria**
- The migration script runs cleanly and creates the `style_profiles` table. 