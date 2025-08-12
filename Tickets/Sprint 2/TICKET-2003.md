# TICKET-2003: Implement Merchant `POST /api/v1/tools` Endpoint 🆕

## Description
Create the API endpoint that allows a logged-in Merchant to register a new tool. Uses RBAC.

## Requirements
- Endpoint: `POST /api/v1/tools`
- Protection: `rbacMiddleware(['MERCHANT'])`
- Body:
```json
{
  "name": "string",
  "description": "string",
  "pricing_model": { "type": "string", "cost_per_use": 0.0 },
  "api_specification_url": "string"
}
```
- 201 on success, 403 if not Merchant

## Test Suite Design
- Merchant creates tool → 201 and valid ID
- Agent attempts → 403

## Acceptance Criteria
- Merchant can create a new tool
- Unauthorized user cannot create tool 