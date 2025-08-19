#!/usr/bin/env bash
set -euo pipefail

# Load .env from repo root if present
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
if [[ -f "$ROOT_DIR/.env" ]]; then
	set -a
	. "$ROOT_DIR/.env"
	set +a
fi

# Allow SUPABASE_DB_URL fallback
: "${DATABASE_URL:=${SUPABASE_DB_URL:-}}"

if [[ -z "${DATABASE_URL:-}" ]]; then
	echo "DATABASE_URL is required. Set it in your environment or in .env at the repo root." >&2
	exit 1
fi

shopt -s nullglob

# Recreate public schema
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO public;
SQL

# Apply migrations in order
for f in $(ls -1 database/migrations/*.sql | sort); do
	echo "Applying $f"
	psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "Schema refresh complete" 