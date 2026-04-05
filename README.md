# HILO - Modern SaaS Agency Website

Clean SaaS-style website with Next.js frontend and NestJS backend.

## Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, ShadCN UI
- **Backend**: NestJS, Prisma, PostgreSQL
- **Auth**: JWT (admin only)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon/Supabase)
- npm

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Database setup

Create a PostgreSQL database, then copy `apps/api/.env.example` to `apps/api/.env` and set:

```
DATABASE_URL="postgresql://user:password@localhost:5432/your_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32"
PORT=3001
```

Run migrations and create admin user:

```bash
npm run db:push
npm run seed:admin
```

Admin: `admin@hilo.com` / `strongpassword123`

If login always fails, your database may have been seeded with an older default (`admin@softwarehouse.com` / `admin123`). Run `npm run db:seed` or `npm run seed:admin` from `apps/api` again to reset the admin password, then use the credentials above.

### 3. Frontend env

Copy `apps/web/.env.local.example` to `apps/web/.env.local` and set:

- `NEXT_PUBLIC_API_URL=http://localhost:3001` (or your API URL)
- For production builds, set **`NEXT_PUBLIC_SITE_URL`** to the public `https://` origin (no trailing slash) so sitemaps, canonical URLs, and Open Graph tags are correct.

### 4. Run locally

```bash
# Terminal 1 - API
npm run dev:api

# Terminal 2 - Web
npm run dev:web
```

- Frontend: http://localhost:3000
- API: http://localhost:3001
- Admin: http://localhost:3000/admin

## Features

- **Header**: Sticky floating nav (Portfolio, Testimonials, Contact)
- **Public**: Portfolio, Testimonials, Contact form
- **Admin**: Website Settings, Portfolio CRUD, Testimonials CRUD, Leads
- **Contact form** → saves to Leads (view in admin)

## Production checklist

- **Web**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` pointing at the deployed API.
- **API**: Set **`CORS_ORIGIN`** to your frontend origin (e.g. `https://yourdomain.com`). If omitted in production, the server logs a warning and allows all origins.
- **Blog / sitemap**: Dummy blog posts are **off in production** when the API returns no posts (blog index, individual post fallback, and sitemap stay aligned). For local QA, set `NEXT_PUBLIC_USE_DUMMY_SITEMAP=true`.
- **Social previews**: Default share image is generated at `/opengraph-image` (see `apps/web/app/opengraph-image.tsx`). Optional: `NEXT_PUBLIC_OG_IMAGE` for a static image URL.

## Project structure

```
apps/
  web/     - Next.js frontend
  api/     - NestJS backend
```
