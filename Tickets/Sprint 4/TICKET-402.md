### TICKET-402: DB Schema for Style Artifact Versions 📝

**Description**
Create the `style_profile_versions` table to store a historical record of all style kernels, thresholds, and lexicons. This is critical for versioning and rollback.

**Requirements**
- Table: `style_profile_versions(id UUID, style_profile_id UUID FK, version INTEGER, kernel_json JSONB, thresholds_json JSONB, created_at TIMESTAMPZ)`

**Acceptance Criteria**
- The migration script creates the `style_profile_versions` table with all specified fields and foreign keys. 