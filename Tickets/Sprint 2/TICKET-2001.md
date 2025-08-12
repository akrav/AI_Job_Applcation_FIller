# TICKET-2001: Update Core Database Schema for Tools 🛠️

## Description
Update PostgreSQL with the new `tools` table and add last-updated support for merchants as needed for the Tool Registry.

## Requirements

### Table: tools
| Field | Type | Notes |
|------|------|------|
| `id` | UUID | Primary Key |
| `merchant_id` | UUID | Foreign Key to `merchants.user_id` |
| `name` | VARCHAR | Not Null |
| `description` | TEXT | Not Null |
| `pricing_model` | JSONB | Not Null |
| `api_specification_url` | VARCHAR | Not Null |
| `is_listed` | BOOLEAN | Default `true` |
| `created_at` | TIMESTAMPTZ | Not Null |
| `updated_at` | TIMESTAMPTZ | Not Null |

- Add `last_updated` on `merchants` if required.
- Update ERD to include `tools`.

## Test Suite Design
- Migration test confirming `tools` table creation
- Schema test verifying columns, types, FKs

## Acceptance Criteria
- `tools` table exists with specified schema
- `merchant_id` references `merchants.user_id` 