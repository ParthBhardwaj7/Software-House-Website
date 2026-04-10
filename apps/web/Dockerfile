# syntax=docker/dockerfile:1
# Build context must be the monorepo root:  docker build -f apps/web/Dockerfile .
#
# NEXT_PUBLIC_* vars are baked into the client bundle at build time.
# Pass them as --build-arg (or via GitHub Actions build-args).

# ────────────────────────────────────────────────────────────
# Stage 1 – Builder
# ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace manifests for layer caching
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

# Install all deps for the web workspace (devDeps needed for tailwind, eslint, typescript)
RUN npm ci --workspace=web --include-workspace-root

# Copy web source
COPY apps/web/ ./apps/web/

# NEXT_PUBLIC_* must be set at BUILD TIME — they are inlined into the client bundle
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Build Next.js with standalone output
# outputFileTracingRoot (set in next.config.js) points to /app so
# node_modules from the workspace root are correctly traced into standalone/
RUN npm run build --workspace=web

# ────────────────────────────────────────────────────────────
# Stage 2 – Runner  (~150MB vs 1GB+ without standalone)
# ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# With outputFileTracingRoot=/app (monorepo root), the standalone directory
# mirrors the monorepo structure:
#   standalone/server.js          ← Next.js server entrypoint
#   standalone/node_modules/      ← minimal runtime deps traced from /app
#   standalone/apps/web/.next/    ← server-side chunks
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

# Static assets (client-side JS/CSS) are NOT included in standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Public directory
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

# server.js is at the root of standalone — run it from WORKDIR /app
CMD ["node", "server.js"]
