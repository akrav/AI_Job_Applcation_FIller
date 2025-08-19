# TICKET-112: Implement `DELETE /api/v1/templates/{id}` Endpoint 🗑️

## Description
Create delete endpoint for templates.

## Requirements
- Endpoint: `DELETE /api/v1/templates/{id}`
- Protected by JWT; can only delete owned template

## Acceptance Criteria
- Authenticated user can delete own template; returns 204 