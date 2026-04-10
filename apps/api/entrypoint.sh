#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
# Run from apps/api so prisma finds schema.prisma at ./prisma/schema.prisma
cd /app/apps/api
/app/node_modules/.bin/prisma migrate deploy

echo "[entrypoint] Starting NestJS API..."
exec node /app/apps/api/dist/main.js
