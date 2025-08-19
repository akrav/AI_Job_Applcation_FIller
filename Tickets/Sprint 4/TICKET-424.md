### TICKET-424: Implement `PUT /style/profiles/:id/activate-version` Endpoint ↩️

**Description**
Create the API endpoint that allows a user to "roll back" to a previous version of their style profile by setting it as the `active_version_id`.

**Requirements**
- Endpoint: `PUT /style/profiles/:id/activate-version`.

**Acceptance Criteria**
- The endpoint successfully updates the `active_version_id` for a style profile. 