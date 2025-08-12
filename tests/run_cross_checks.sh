#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
FAIL=0

check() {
  local path="$1"
  if [ -e "$ROOT_DIR/$path" ]; then
    echo "[OK] $path"
  else
    echo "[MISSING] $path" >&2
    FAIL=1
  fi
}

# Tickets
for n in {1001..1008}; do
  check "Tickets/Sprint 1/TICKET-$n.md"
done

# Build docs
check "Build_documentation/API-Reference.md"
check "Build_documentation/Schemas.md"
check "Build_documentation/Sprint-Progress.md"
check "Build_documentation/Troubleshooting.md"
check "Build_documentation/Project Structure Documentation.md"
check "Build_documentation/Best-Practices.md"

# Database
check "database/migrations"
check "database/scripts/refresh_database.sh"
check "database/scripts/verify_schema.sql"

if [ "$FAIL" -eq 0 ]; then
  echo "✅ Cross checks passed"
else
  echo "❌ Cross checks failed" >&2
  exit 1
fi 