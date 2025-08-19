# TICKET-109: Implement `POST /api/v1/templates` Endpoint ✍️

## Description
Create secure API endpoint for creating a new template.

## Requirements
- Endpoint: `POST /api/v1/templates`
- Protected by JWT; `user_id` set to authenticated user

## Acceptance Criteria
- Authenticated user can create a template
- Returns 201 with created object 