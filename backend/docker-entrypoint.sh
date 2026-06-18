#!/bin/sh
# ============================================================================
# Sokogate API — Docker Entrypoint
#
# 1. Runs pending database migrations (safe to run every startup — no-op if up-to-date)
# 2. Seeds demo data in development
# 3. Starts the Node.js server
# ============================================================================
set -e

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
