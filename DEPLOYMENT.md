# Software House — Full Docker + CI/CD Deployment Guide

> **Ye document ek complete reference hai** — agar server crash ho, naya droplet banana ho,
> ya koi aur deploy kare, sab kuch yahan se mil jayega bina kisi se puche.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [How Everything Connects](#2-how-everything-connects)
3. [Prerequisites](#3-prerequisites)
4. [GitHub Secrets Setup](#4-github-secrets-setup)
5. [Server First-Time Setup](#5-server-first-time-setup)
6. [Nginx Reverse Proxy Setup](#6-nginx-reverse-proxy-setup)
7. [How Deployment Works (Automatic)](#7-how-deployment-works-automatic)
8. [Manual Deployment (Emergency)](#8-manual-deployment-emergency)
9. [Debug Commands Cheatsheet](#9-debug-commands-cheatsheet)
10. [All Bugs We Fixed + Why](#10-all-bugs-we-fixed--why)
11. [Key Concepts Explained Simply](#11-key-concepts-explained-simply)
12. [Project File Reference](#12-project-file-reference)

---

## 1. Architecture Overview

```
Internet (Browser)
        │
        ▼
DigitalOcean Droplet  ─────────────────────────────────────────
│                                                              │
│   Nginx (port 80 / 443)                                     │
│       │                                                      │
│       ├── /api/*  ──strips /api/──► Docker: NestJS :3001    │
│       │                                     │               │
│       │                             PostgreSQL :5432        │
│       │                                                      │
│       └── /*  ──────────────────► Docker: Next.js :3000    │
│                                                              │
────────────────────────────────────────────────────────────────

GitHub Container Registry (GHCR)
  ghcr.io/parthbhardwaj7/software-house-api:latest
  ghcr.io/parthbhardwaj7/software-house-web:latest
```

### Port Map

| Service    | Internal Docker Port | External (Nginx proxied) |
|------------|---------------------|--------------------------|
| Next.js    | 3000                | Port 80 → `/`            |
| NestJS API | 3001                | Port 80 → `/api/`        |
| PostgreSQL | 5432                | Not exposed publicly     |

---

## 2. How Everything Connects

```
git push origin main
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml)
        │
        ├─ Step 1: Checkout code
        │
        ├─ Step 2: Login to GHCR (GitHub's Docker registry)
        │
        ├─ Step 3: Build API Docker image
        │           apps/api/Dockerfile
        │           Output: ghcr.io/user/software-house-api:latest
        │
        ├─ Step 4: Build Web Docker image
        │           apps/web/Dockerfile
        │           NEXT_PUBLIC_API_URL baked in here permanently
        │           Output: ghcr.io/user/software-house-web:latest
        │
        └─ Step 5: SSH into DigitalOcean server
                    ├─ git pull (sync code)
                    ├─ docker compose pull (download new images)
                    └─ docker compose up -d (restart containers)
```

### Important: NEXT_PUBLIC_* Variables

```
NEXT_PUBLIC_API_URL aur NEXT_PUBLIC_SITE_URL → ye SIRF build time pe set hote hain.
Docker image ke andar permanently bake ho jaate hain.
Agar change karna ho → GitHub Secret update karo → naya push karo → image rebuild hogi.
Runtime pe .env se NAHI aate.
```

---

## 3. Prerequisites

### Local Machine
- Node.js 18+
- Git
- Docker Desktop (optional, local testing ke liye)

### DigitalOcean Server (Ubuntu 22.04+)

```bash
# Docker install karo
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Docker Compose v2 check karo
docker compose version

# Nginx install karo
apt update && apt install -y nginx

# UFW firewall rules
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS (future SSL ke liye)
ufw allow 3000/tcp   # Direct access (optional)
ufw allow 3001/tcp   # Direct access (optional)
ufw enable
```

---

## 4. GitHub Secrets Setup

GitHub repo → Settings → Secrets and Variables → Actions → New repository secret

| Secret Name | Value | Kahan Use Hota Hai |
|-------------|-------|--------------------|
| `DO_HOST` | `167.71.230.103` | Server ka IP |
| `DO_USERNAME` | `root` | SSH login user |
| `DO_SSH_KEY` | Private SSH key (pura, `-----BEGIN` se `-----END` tak) | Server pe SSH karne ke liye |
| `NEXT_PUBLIC_API_URL` | `https://apncodix.com/api` | Next.js mein API calls ke liye (build time) � HTTPS required |
| `NEXT_PUBLIC_SITE_URL` | `http://apncodix.com` | Site URL (build time) |

### SSH Key Generate Kaise Karo (agar nahi hai)

```bash
# Local machine pe
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key

# Public key server pe daalo
ssh-copy-id -i ~/.ssh/deploy_key.pub root@167.71.230.103
# YA manually:
# cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys  (server pe)

# Private key GitHub Secret mein daalo
cat ~/.ssh/deploy_key
# Pura output copy karo → DO_SSH_KEY secret mein paste karo
```

---

## 5. Server First-Time Setup

```bash
# 1. Server pe SSH karo
ssh root@167.71.230.103

# 2. Repo clone karo
git clone https://github.com/ParthBhardwaj7/Software-House-Website.git ~/Software-House-Website
cd ~/Software-House-Website

# 3. Production env file banao
cat > .env << 'EOF'
POSTGRES_DB=software_house
POSTGRES_USER=postgres
POSTGRES_PASSWORD=STRONG_PASSWORD_YAHAN_LIKHO
DATABASE_URL=postgresql://postgres:STRONG_PASSWORD_YAHAN_LIKHO@postgres:5432/software_house
JWT_SECRET=RANDOM_LONG_SECRET_YAHAN_LIKHO
JWT_REFRESH_SECRET=ANOTHER_RANDOM_LONG_SECRET_YAHAN_LIKHO
EOF

# 4. GHCR se images pull karne ke liye login karo
# (GitHub → Settings → Developer settings → Personal access tokens → Classic)
# Permissions chahiye: read:packages
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 5. Pehli baar manually start karo (baad mein GitHub Actions automatic karega)
export API_IMAGE=ghcr.io/parthbhardwaj7/software-house-api:latest
export WEB_IMAGE=ghcr.io/parthbhardwaj7/software-house-web:latest
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 6. Check karo sab chal raha hai
docker ps
```

Expected output:
```
NAMES                                STATUS
software-house-website-web-1         Up X minutes
software-house-website-api-1         Up X minutes (healthy)
software-house-website-postgres-1    Up X minutes (healthy)
```

---

## 6. Nginx Reverse Proxy Setup

Nginx Docker ke upar baitha hai. Browser → Nginx (port 80) → Docker containers.

```bash
# 1. Config file banao
cat > /etc/nginx/sites-available/software-house << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 167.71.230.103 apncodix.com www.apncodix.com;

    # ─────────────────────────────────────────────────────
    # API Routes → NestJS (port 3001)
    # IMPORTANT: trailing slash in proxy_pass strips /api/ prefix
    # Browser bhejta hai: POST /api/contact
    # NestJS receive karta hai: POST /contact
    # ─────────────────────────────────────────────────────
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ─────────────────────────────────────────────────────
    # All Other Routes → Next.js (port 3000)
    # ─────────────────────────────────────────────────────
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# 2. Enable karo (symlink banao)
ln -sf /etc/nginx/sites-available/software-house /etc/nginx/sites-enabled/

# 3. Default page hatao (warna ye priority lega)
rm -f /etc/nginx/sites-enabled/default

# 4. Syntax check karo
nginx -t

# 5. Reload karo (zero downtime)
systemctl reload nginx
```

### Nginx Mental Model

```
sites-available/  → Sab config files yahan store hote hain (enabled ho ya na ho)
sites-enabled/    → Sirf symlinks hote hain active configs ke
                    Nginx sirf yahan se padhta hai

Agar sites-available mein config hai par sites-enabled mein symlink nahi
→ Nginx use karega HI NAHI
```

---

## 7. How Deployment Works (Automatic)

Ek baar setup ke baad, deploy karna sirf itna hai:

```bash
git add .
git commit -m "kuch bhi change"
git push origin main
```

GitHub Actions baki sab khud karta hai. Track karo:
`github.com/ParthBhardwaj7/Software-House-Website/actions`

### GitHub Actions Workflow Breakdown

```yaml
# .github/workflows/deploy.yml

on:
  push:
    branches: [main]       # main pe push → trigger

jobs:
  build-and-deploy:

    # Step 1: Code checkout
    - uses: actions/checkout@v4

    # Step 2: GHCR login
    - uses: docker/login-action@v3
      with:
        registry: ghcr.io
        password: ${{ secrets.GITHUB_TOKEN }}  # auto-provided, no secret needed

    # Step 3: API image build + push
    - uses: docker/build-push-action@v6
      with:
        context: .
        file: apps/api/Dockerfile
        tags: ghcr.io/user/software-house-api:latest

    # Step 4: Web image build + push
    - uses: docker/build-push-action@v6
      with:
        context: .
        file: apps/web/Dockerfile
        build-args: |
          NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
        tags: ghcr.io/user/software-house-web:latest

    # Step 5: Server pe deploy
    - uses: appleboy/ssh-action@v1.0.3
      with:
        script: |
          cd ~/Software-House-Website
          git reset --hard origin/main
          docker compose -f docker-compose.prod.yml pull
          docker compose -f docker-compose.prod.yml up -d
          docker image prune -f
```

---

## 8. Manual Deployment (Emergency)

Agar GitHub Actions kaam na kare ya urgent fix chahiye:

```bash
# Server pe SSH karo
ssh root@167.71.230.103
cd ~/Software-House-Website

# Latest code lo
git fetch origin main
git reset --hard origin/main

# GHCR login (agar token expire hua ho)
echo "GITHUB_TOKEN" | docker login ghcr.io -u GITHUB_USERNAME --password-stdin

# Images pull karo
export API_IMAGE=ghcr.io/parthbhardwaj7/software-house-api:latest
export WEB_IMAGE=ghcr.io/parthbhardwaj7/software-house-web:latest
docker compose -f docker-compose.prod.yml pull

# Restart karo
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# Verify karo
docker ps
docker logs --tail 20 software-house-website-api-1
```

---

## 9. Debug Commands Cheatsheet

### Container Status

```bash
# Sab containers dekho
docker ps

# Stopped containers bhi dekho
docker ps -a

# Container restart count dekho (agar baar baar restart ho raha)
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.RestartCount}}"
```

### Logs

```bash
# API ke last 50 lines
docker logs --tail 50 software-house-website-api-1

# Web ke last 50 lines
docker logs --tail 50 software-house-website-web-1

# Live logs (Ctrl+C to stop)
docker logs -f software-house-website-api-1
```

### Local Testing on Server

```bash
# Web accessible hai?
curl -s -o /dev/null -w "Web: %{http_code}\n" http://localhost:3000

# API alive hai?
curl -s -o /dev/null -w "API: %{http_code}\n" http://localhost:3001

# Nginx se web accessible hai?
curl -s -o /dev/null -w "Nginx→Web: %{http_code}\n" http://localhost

# API route through nginx
curl -s -o /dev/null -w "Nginx→API: %{http_code}\n" http://localhost/api/health
```

### Environment Variables

```bash
# Web container mein kya env vars hain?
docker exec software-house-website-web-1 env | grep NEXT_PUBLIC

# API container mein
docker exec software-house-website-api-1 env
```

### Nginx

```bash
nginx -t                          # Config syntax check
systemctl reload nginx            # Apply changes (zero downtime)
systemctl restart nginx           # Full restart
systemctl status nginx            # Status
cat /var/log/nginx/error.log      # Error logs
tail -f /var/log/nginx/access.log # Live access logs
ls -la /etc/nginx/sites-enabled/  # Active configs
```

### Docker Cleanup

```bash
# Purani unused images hatao (disk space bachao)
docker image prune -f

# Sab kuch nuke karo (CAREFUL - containers bhi band honge)
docker system prune -a

# Sirf stopped containers hatao
docker container prune
```

### Restart Everything

```bash
cd ~/Software-House-Website
export API_IMAGE=ghcr.io/parthbhardwaj7/software-house-api:latest
export WEB_IMAGE=ghcr.io/parthbhardwaj7/software-house-web:latest
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

---

## 10. All Bugs We Fixed + Why

---

### Bug 1 — `module: nodenext` in tsconfig.json

**Error Message:**
```
Error: Cannot find module '/app/apps/api/dist/main.js'
```

**Kya Hua:**
`apps/api/tsconfig.json` mein tha:
```json
"module": "nodenext",
"moduleResolution": "nodenext"
```

NestJS ek **CommonJS** framework hai — ye `require()` use karta hai.
`nodenext` **ESM** (ES Modules) ke liye hai — ye `import/export` use karta hai.

Is mismatch ki wajah se `nest build` (webpack) silently fail hua — exit code `0` diya
(Docker ko laga sab theek hai) lekin `dist/` folder bana hi nahi.

**Fix:**
```json
// apps/api/tsconfig.json
"module": "commonjs",
"moduleResolution": "node"
```

**Rule:**
> NestJS = HAMESHA `commonjs`. Kabhi `nodenext` mat use karo NestJS ke saath.

---

### Bug 2 — Next.js `server.js` Wrong Path

**Error Message:**
```
Error: Cannot find module '/app/server.js'
```

**Kya Hua:**
`apps/web/Dockerfile` mein tha:
```dockerfile
CMD ["node", "server.js"]
```

Lekin `next.config.js` mein tha:
```js
outputFileTracingRoot: path.join(__dirname, '../../')  // monorepo root
```

Jab `outputFileTracingRoot` monorepo root pe point karta hai, Next.js apna
`standalone/` output **project ka structure mirror karke** banata hai:

```
# Galat samajh (jo hum soch rahe the):
standalone/
  server.js        ← root mein hoga

# Actual output:
standalone/
  apps/
    web/
      server.js    ← app ke relative path pe hota hai!
  node_modules/
```

To Docker mein `COPY standalone ./` ke baad file thi `/app/apps/web/server.js`,
na ki `/app/server.js`.

**Fix:**
```dockerfile
# apps/web/Dockerfile
CMD ["node", "apps/web/server.js"]
```

**Rule:**
> Monorepo mein `outputFileTracingRoot` use karo to `server.js` app ke
> path pe nest hota hai, root pe nahi.

---

### Bug 3 — `nest build` (Webpack) Silent Failure in Docker

**Error Message:**
```
Error: Cannot find module '/app/apps/api/dist/main.js'
```
(Same error, tsconfig fix ke baad bhi)

**Kya Hua:**
`nest build` webpack use karta hai internally. Docker + npm workspace environment mein:
- `node_modules` `/app/` mein hain (hoisted)
- WORKDIR tha `/app/apps/api`
- Webpack apne internal plugins ko resolve nahi kar paya
- **Exit code `0` diya** (Docker ko lagaa successful raha)
- Lekin `dist/` folder bana hi nahi

**Fix:**
`nest build` bypass karo, seedha `tsc` use karo:
```dockerfile
# apps/api/Dockerfile — builder stage mein
RUN npx tsc -p tsconfig.build.json

# Guard: agar file nahi bani to build fail karo loudly
RUN test -f dist/main.js || (echo "ERROR: dist/main.js missing!" && exit 1)
```

**Rule:**
> Monorepo Docker builds mein `nest build` webpack silently fail kar sakta hai.
> `tsc` seedha zyada reliable hai. Guard hamesha lagao taaki future mein
> silent failures GHA logs mein visible ho sakein.

---

### Bug 4 — TypeScript Output Galat Path Pe (`dist/src/main.js`)

**Error (Guard se mila):**
```
ERROR: dist/main.js missing after tsc — check tsconfig.build.json
```

**Kya Hua — TypeScript ka `rootDir` Auto-Calculation:**

Jab `rootDir` explicitly set nahi hota, TypeScript **automatically compute karta hai**
rootDir as the **common ancestor of ALL included `.ts` files**.

`tsconfig.build.json` mein exclude tha: `test/`, `**/*spec.ts` — lekin `prisma/` nahi!

```
# Include hue files:
apps/api/src/main.ts           ← NestJS source
apps/api/src/modules/**/*.ts   ← NestJS source
apps/api/prisma/seed.ts        ← Seed file (EXCLUDE NAHI THA!)
apps/api/prisma/seed-admin.ts  ← Seed file (EXCLUDE NAHI THA!)
```

TypeScript ne dekha files `src/` aur `prisma/` dono mein hain.
Common ancestor = `apps/api/` (parent of both).

**Auto-computed rootDir = `apps/api/`**

Output structure bana:
```
src/main.ts      →  dist/src/main.js    ← GALAT! Entrypoint expect karta tha dist/main.js
prisma/seed.ts   →  dist/prisma/seed.js
```

**Fix (`apps/api/tsconfig.build.json`):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src"
  },
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts", "prisma"]
}
```

Ab output:
```
src/main.ts  →  dist/main.js  ✅
```

**Rule:**
> HAMESHA `rootDir: "./src"` explicitly set karo build tsconfig mein.
> ALL non-source directories exclude karo: `prisma`, `scripts`, `seeds`, etc.
> Warna TypeScript auto-compute karega aur output wrong path pe jayega.

---

### Bug 5 — Nginx Default Page Dikh Raha Tha

**Error:** "Welcome to nginx!" dikh raha tha instead of site.

**Kya Hua:**
Do possible wajahein:
1. `software-house` config `sites-available` mein tha par `sites-enabled` mein
   symlink nahi tha
2. `default` site abhi bhi active thi aur uski priority thi

**Fix:**
```bash
# Symlink banao (config activate karo)
ln -sf /etc/nginx/sites-available/software-house /etc/nginx/sites-enabled/

# Default page hatao
rm -f /etc/nginx/sites-enabled/default

# Reload
nginx -t && systemctl reload nginx
```

**Rule:**
> `sites-available` = sirf storage. `sites-enabled` = active configs (symlinks).
> Bina symlink ke config kaam nahi karega. `default` hamesha remove karo.

---

### Bug 6 — `Cannot POST /api/contact` (404)

**Error:** NestJS 404 return kar raha tha API calls pe.

**Kya Hua:**
Nginx config mein tha:
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;   ← trailing slash NAHI
}
```

**Bina trailing slash ke**: Nginx poora path forward karta hai.
```
Browser  →  POST /api/contact
Nginx    →  POST /api/contact  (to port 3001)
NestJS   →  Route /api/contact? NOT FOUND → 404
```

NestJS routes hain: `/contact`, `/leads`, `/auth/login` — koi `/api/` prefix nahi.

**Fix — Trailing Slash add karo:**
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001/;  ← trailing slash HAI
}
```

**Trailing slash ke saath**: Nginx location prefix strip karta hai.
```
Browser  →  POST /api/contact
Nginx    →  POST /contact  (to port 3001) — /api/ strip ho gaya
NestJS   →  Route /contact? FOUND → 200 ✅
```

**Rule:**
> `proxy_pass` mein trailing slash = location prefix strip hota hai.
> `proxy_pass` mein trailing slash nahi = full path forward hota hai.
> NestJS routes mein `/api/` prefix nahi hota, isliye trailing slash zaruri hai.

---

## 11. Key Concepts Explained Simply

### Docker Multi-Stage Build

```
Kyu? Builder image 900MB+ hoti hai (TypeScript compiler, NestJS CLI, etc.)
     Final image sirf 150-200MB ki honi chahiye (only runtime needed)

Kaise?
  Stage 1 (builder): Sab kuch install karo, code compile karo
  Stage 2 (runner):  Sirf compiled output copy karo, dev tools nahi

Result: Production image choti, fast to pull, less attack surface
```

### Docker Layer Caching

```
Har Dockerfile instruction ek "layer" hai.
Agar instruction nahi badla → cache se serve hota hai (instant)
Agar instruction badla → ye aur iske baad sab layers re-run hoti hain

Isliye ye order SAHI hai:
  COPY package.json ./        ← rarely changes → cached zyada
  RUN npm ci                  ← slow, cached jab package.json nahi bada
  COPY apps/api/ ./apps/api/  ← frequently changes → ye layer miss hogi
  RUN npx tsc ...             ← re-runs sirf jab source code bada

Aur ye order GALAT hai:
  COPY . .                    ← koi bhi file badli to npm ci dobara chalega
  RUN npm ci                  ← SLOW! Har baar
```

### npm Workspaces

```
Monorepo structure:
  package.json (root) - workspaces: ["apps/*"]
  apps/api/package.json
  apps/web/package.json

npm sab dependencies ko ROOT node_modules mein install karta hai (hoisting).
Matlab:
  /app/node_modules/typescript    ← API ka TypeScript yahan hai
  /app/node_modules/.bin/tsc      ← binary yahan hai
  /app/node_modules/.bin/nest     ← NestJS CLI yahan hai

Isliye Docker mein `npx tsc` ya `npx prisma` use karo — ye hoisted packages dhundhta hai.
```

### Next.js Standalone Output

```
Normal Next.js build → node_modules 1GB+ chahiye runtime pe
Standalone build     → sirf zaruri files trace karta hai → ~50MB

next.config.js mein:
  output: 'standalone'

Ye banata hai:
  .next/standalone/
    server.js         ← ye run karo
    node_modules/     ← minimal, traced dependencies
    apps/web/.next/   ← server chunks (monorepo mein nested hota hai)

Run karne ka tarika:
  node apps/web/server.js
```

### Nginx `proxy_pass` Trailing Slash Rule

```
Rule:
  Bina trailing slash: proxy_pass http://localhost:3001
    /api/users  →  /api/users  (full path as-is)

  Trailing slash ke saath: proxy_pass http://localhost:3001/
    /api/users  →  /users  (/api/ strip ho gaya)

Example:
  location /api/ {
    proxy_pass http://localhost:3001/;  ← / means strip /api/
  }
  Browser: GET /api/contacts
  NestJS receives: GET /contacts  ✅
```

---

## 12. Project File Reference

### Critical Files — Change Karte Waqt Dhyan Rakhna

| File | Kya Karta Hai | Common Mistake |
|------|---------------|----------------|
| `apps/api/tsconfig.json` | TypeScript config for NestJS | `module: nodenext` use mat karo |
| `apps/api/tsconfig.build.json` | Build-specific TS config | `rootDir: "./src"` aur `prisma` exclude zaruri hai |
| `apps/api/Dockerfile` | API Docker image build | `npm run build` ki jagah `npx tsc` use karo |
| `apps/web/Dockerfile` | Web Docker image build | CMD mein `apps/web/server.js` — root ka nahi |
| `apps/web/next.config.js` | Next.js configuration | `outputFileTracingRoot` monorepo root pe point karna |
| `.github/workflows/deploy.yml` | CI/CD pipeline | NEXT_PUBLIC vars yahan inject hote hain |
| `docker-compose.prod.yml` | Production containers | `API_IMAGE`/`WEB_IMAGE` env vars se aata hai |
| `/etc/nginx/sites-available/software-house` | Nginx proxy config (server pe) | Trailing slash in API `proxy_pass` |

### Environment Variables Reference

```bash
# .env (server pe, docker-compose ke liye)
POSTGRES_DB=software_house
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
DATABASE_URL=postgresql://postgres:PASSWORD@postgres:5432/software_house
JWT_SECRET=
JWT_REFRESH_SECRET=

# GitHub Secrets (Actions ke liye)
DO_HOST=167.71.230.103
DO_USERNAME=root
DO_SSH_KEY=<private key>
NEXT_PUBLIC_API_URL=http://apncodix.com/api
NEXT_PUBLIC_SITE_URL=http://apncodix.com
```

---

## Quick Reference Card

```
Naya deploy karna?
  → git push origin main  (bas itna)

Site nahi dikh rahi?
  → docker ps  (containers running hain?)
  → nginx -t && systemctl reload nginx  (nginx theek hai?)
  → curl http://localhost:3000  (locally kaam karta hai?)

API 404 dikh rahi?
  → grep proxy_pass /etc/nginx/sites-available/software-house
  → Trailing slash check karo: proxy_pass http://127.0.0.1:3001/;

Container restart loop mein?
  → docker logs --tail 50 <container-name>

Docker image nahi ban rahi (GHA fail)?
  → GHA logs dekho: github.com/REPO/actions
  → `dist/main.js missing` error = tsconfig.build.json check karo

NEXT_PUBLIC vars change karne hain?
  → GitHub Secrets update karo
  → git push (kuch bhi) karo taaki image rebuild ho

Poora system restart?
  → cd ~/Software-House-Website
  → export API_IMAGE=ghcr.io/parthbhardwaj7/software-house-api:latest
  → export WEB_IMAGE=ghcr.io/parthbhardwaj7/software-house-web:latest
  → docker compose -f docker-compose.prod.yml up -d
```

---

*Last updated: April 2026 — All bugs documented from actual production debugging session.*
