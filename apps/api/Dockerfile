# syntax=docker/dockerfile:1
# Build context must be the monorepo root:  docker build -f apps/api/Dockerfile .

# ────────────────────────────────────────────────────────────
# Stage 1 – Builder
# Installs all deps (devDeps included) and compiles TypeScript
# ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build tools for native modules (bcrypt uses node-pre-gyp on Alpine)
RUN apk add --no-cache python3 make g++ openssl

# Copy workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install ALL deps (devDeps needed for @nestjs/cli + typescript)
RUN npm ci --workspace=api --include-workspace-root

# Copy API source
COPY apps/api/ ./apps/api/

# Generate Prisma client + compile NestJS
WORKDIR /app/apps/api
RUN npx prisma generate
# Use tsc directly — more reliable than nest build (webpack) in a Docker/monorepo context
RUN npx tsc -p tsconfig.build.json
# Fail the build loudly if the entrypoint wasn't produced
RUN test -f dist/main.js || (echo "ERROR: dist/main.js missing after tsc — check tsconfig.build.json" && exit 1)

# ────────────────────────────────────────────────────────────
# Stage 2 – Runner (production image)
# Only production deps; no build tools in the final image
# ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# OpenSSL is required at runtime by the Prisma query engine
# Build tools are only needed during npm ci (to compile bcrypt), then removed
RUN apk add --no-cache openssl python3 make g++

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install prod deps only — prisma is now in dependencies so it's included here
RUN npm ci --workspace=api --include-workspace-root --omit=dev \
  && apk del python3 make g++ \
  && npm cache clean --force

# Copy Prisma schema + migrations (needed for migrate deploy at startup)
COPY apps/api/prisma ./apps/api/prisma

# Generate Prisma client for Alpine (linux-musl) platform
# Uses the locally installed prisma CLI (now a regular dependency)
RUN cd apps/api && npx prisma generate

# Copy compiled NestJS dist + seed script from builder
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist

# Copy and prepare the entrypoint
COPY apps/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER nestjs

EXPOSE 3001

# entrypoint.sh runs: prisma migrate deploy → node dist/main.js
ENTRYPOINT ["/entrypoint.sh"]
