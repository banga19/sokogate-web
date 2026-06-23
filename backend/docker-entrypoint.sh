#!/bin/sh
# ============================================================================
# Sokogate API — Docker Entrypoint
#
# 1. Waits for PostgreSQL to be ready (with retries)
# 2. Runs pending database migrations (safe to run every startup — no-op if up-to-date)
# 3. Seeds demo data in development
# 4. Starts the Node.js server
# ============================================================================
set -e

echo "⏳ Waiting for PostgreSQL..."
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-sokogate}"
retries=30
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1 || [ $retries -eq 0 ]; do
  retries=$((retries - 1))
  echo "  PostgreSQL not ready yet... ($retries retries left)"
  sleep 2
done
if [ $retries -eq 0 ]; then
  echo "❌ PostgreSQL did not become ready in time."
  exit 1
fi
echo "✅ PostgreSQL is ready."

echo "👉 Running database migrations..."
npx sequelize-cli db:migrate
echo "✅ Migrations complete."

# Seed only in development
if [ "$NODE_ENV" = "development" ]; then
  echo "👉 Seeding demo data..."
  npx sequelize-cli db:seed:all 2>/dev/null || echo "ℹ️  Seed skipped (no seeders or already seeded)."
fi

echo "🚀 Starting server..."
exec node src/server.js
