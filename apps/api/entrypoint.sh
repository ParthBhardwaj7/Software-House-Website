#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
# Run from apps/api so prisma finds schema.prisma at ./prisma/schema.prisma
cd /app/apps/api
/app/node_modules/.bin/prisma migrate deploy

echo "[entrypoint] Seeding admin user + default settings..."
# seed-admin.js lives in prisma/ and is COPY'd into the runner stage directly.
# No TypeScript compilation required — plain JS runs with the bundled node.
# Env vars ADMIN_EMAIL / ADMIN_PASSWORD override the built-in defaults.
node /app/apps/api/prisma/seed-admin.js

echo "[entrypoint] Starting NestJS API..."
exec node /app/apps/api/dist/main.js
