#!/usr/bin/env bash
set -euo pipefail

# Refresh the database schema for the project.
# This script assumes the presence of a migration runner (to be implemented)
# and uses environment variables for DB connection.

ROOT_DIR="$(cd "$(dirname "$0")"/../.. && pwd)"
MIGRATIONS_DIR="$ROOT_DIR/database/migrations"
VERIFY_SQL="$ROOT_DIR/database/scripts/verify_schema.sql"

echo "==> Refreshing database (drop + recreate public schema)"
psql "${DATABASE_URL:-}" -v ON_ERROR_STOP=1 <<'SQL'
BEGIN;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
COMMIT;
SQL

echo "==> Applying migrations from: $MIGRATIONS_DIR"
# Placeholder: apply SQL files in order if present
for file in "$MIGRATIONS_DIR"/*.sql; do
  [ -e "$file" ] || continue
  echo "   -> Applying $file"
  psql "${DATABASE_URL:-}" -v ON_ERROR_STOP=1 -f "$file"
done

echo "==> Verifying schema"
psql "${DATABASE_URL:-}" -v ON_ERROR_STOP=1 -f "$VERIFY_SQL"

echo "✅ Database refresh complete" 