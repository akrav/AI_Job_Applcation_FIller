### TICKET-422: Implement `POST /style/profiles/:id/generate` Endpoint 🚀

**Description**
Create the primary endpoint for generating a styled paragraph. This will orchestrate the entire generation pipeline (`TICKET-414` to `TICKET-420`).

**Requirements**
- Endpoint: `POST /style/profiles/:id/generate`.
- Logic: The endpoint will accept a task, run the full generation and refinement process, and return the final text with the judge's score.

**Acceptance Criteria**
- The endpoint returns a final paragraph that has passed the judge's score threshold. 