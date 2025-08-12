# TICKET-2005: Implement `DELETE /api/v1/tools/{id}` Endpoint 🗑️

## Description
Create a protected endpoint that allows a Merchant to delist their tool by setting `is_listed` to false.

## Requirements
- Endpoint: `DELETE /api/v1/tools/{id}`
- Protection: `rbacMiddleware(['MERCHANT'])`
- Validate ownership before update

## Test Suite Design
- Merchant delists own tool → 200/204
- Merchant attempts on another merchant's tool → 403/404

## Acceptance Criteria
- A merchant can delist their own tools
- Cannot delist others' tools 