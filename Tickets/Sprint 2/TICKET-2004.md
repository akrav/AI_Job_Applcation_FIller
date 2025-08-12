# TICKET-2004: Implement Merchant `GET /api/v1/tools` Endpoint 🔍

## Description
Create a protected endpoint that allows a Merchant to view their tools. Uses RBAC.

## Requirements
- Endpoint: `GET /api/v1/tools`
- Protection: `rbacMiddleware(['MERCHANT'])`
- 200 returns array of tools where `merchant_id` matches user

## Test Suite Design
- Merchant with two tools → 200 and array length 2
- Agent user → 403

## Acceptance Criteria
- Merchant sees only their own tools
- Unauthorized user denied 