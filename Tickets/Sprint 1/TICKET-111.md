# TICKET-111: Implement `PUT /api/v1/templates/{id}` Endpoint 📝

## Description
Create update endpoint for templates.

## Requirements
- Endpoint: `PUT /api/v1/templates/{id}`
- Protected by JWT; can only update owned template

## Acceptance Criteria
- Authenticated user can update own template; returns 200 with updated object 