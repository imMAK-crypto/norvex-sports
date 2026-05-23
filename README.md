# Norvex Sports

Professional football development platform — Hyderabad.

Built with **Next.js 14 (App Router)**, **Prisma + PostgreSQL**, **Tailwind CSS**, custom JWT-based admin auth, optional **Cloudinary** uploads, and **next/og** for dynamic social cards. SEO is baked in: structured data (SportsActivityLocation, Service, Event, NewsArticle), sitemap, robots, OpenGraph, and per-page meta overrides via the admin panel.

## Quick start (local)

```bash
pnpm install
cp .env.example .env
# edit DATABASE_URL to point at a local Postgres (or Railway dev DB)
pnpm prisma migrate deploy   # or: pnpm prisma db push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000  
Admin panel: http://localhost:3000/admin  
Default admin: the email and password from `.env` (defaults `admin@norvexsports.com` / `ChangeMe!2026`). **Change immediately** via `/admin/settings`.

## Deploy to Railway

1. **Create the project** on Railway and connect this repo.
2. **Add the PostgreSQL plugin** — Railway will inject `DATABASE_URL`.
3. **Set environment variables** (Variables tab):
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g. `https://norvexsports.com`)
   - `SESSION_SECRET` — a long random string (`openssl rand -base64 32`)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` — bootstrap admin credentials
   - `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_WHATSAPP` — optional contact overrides
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — optional, enables in-admin image upload
   - `NEXT_PUBLIC_GA_ID` — optional Google Analytics
   - `GOOGLE_SITE_VERIFICATION` — optional Search Console
4. Railway uses `nixpacks.toml` / `railway.toml` automatically. The start command runs migrations + seed + Next start.
5. Add a custom domain in Railway → Networking and point your DNS at it.
6. Submit your sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`.

## What's editable from the admin panel

- **Services** — title, description, image, icon, SEO, order, visibility (full CRUD)
- **Events** — title, summary, full description, cover image, gallery, date, location, category, registration URL, featured flag (full CRUD)
- **News** — title, excerpt, body, cover image, author, publish date, tags, draft/publish toggle (full CRUD)
- **Gallery** — image, title, caption, category, order (full CRUD)
- **Team** — name, role, bio, qualifications, experience, photo (full CRUD)
- **Site Content** — about (short + long), project statement, contact info, social links
- **Enquiries** — view all contact form submissions, mark read, delete
- **Settings** — change admin password

## SEO checklist (already done)

- ✅ Server-side rendering with full metadata API
- ✅ Per-page canonical URLs
- ✅ Schema.org JSON-LD: `SportsActivityLocation`, `Service`, `Event`, `NewsArticle`, `ItemList`
- ✅ Dynamic OpenGraph image (`next/og`)
- ✅ `sitemap.xml` includes all dynamic content
- ✅ `robots.txt` excludes `/admin`
- ✅ Per-item meta title/description overrides
- ✅ Mobile-first responsive design + theme color
- ✅ Performance: edge-rendered OG, ISR for content pages, AVIF/WebP image formats
- ✅ Semantic HTML — headings, articles, sections, time elements

After launch:
1. Add Google Search Console + Bing Webmaster, submit sitemap
2. Add Google Business Profile for Hyderabad location
3. Add `NEXT_PUBLIC_GA_ID` for Google Analytics
4. Get backlinks from local schools, football blogs, sports directories
5. Publish news posts regularly (the news section is SEO gold for "football academy Hyderabad" queries)

## Project structure

```
app/
  (site)/            ← public pages (header/footer wrap)
  admin/             ← protected admin panel
  api/admin/         ← upload + logout endpoints
  sitemap.ts         ← dynamic sitemap
  robots.ts          ← robots.txt
  opengraph-image.tsx ← dynamic OG image
components/          ← shared UI
lib/                 ← prisma, auth, settings, cloudinary
prisma/
  schema.prisma      ← DB schema
  seed.ts            ← initial admin + seed content
middleware.ts        ← protects /admin
```
