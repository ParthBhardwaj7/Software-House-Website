#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
# Run from apps/api so prisma finds schema.prisma at ./prisma/schema.prisma
cd /app/apps/api
/app/node_modules/.bin/prisma migrate deploy

echo "[entrypoint] Seeding admin user + default settings..."
# seed-admin.js is compiled from prisma/seed-admin.ts during the Docker build
# Env vars ADMIN_EMAIL and ADMIN_PASSWORD can be set to customise credentials
# The seed is idempotent (upsert) so it is safe to run on every container start
node /app/apps/api/dist/prisma/seed-admin.js

echo "[entrypoint] Starting NestJS API..."
exec node /app/apps/api/dist/main.js
