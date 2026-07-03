# MAX SEO + AEO PLAN — norvexsports.in

Execution plan for Opus. Do phases IN ORDER, one at a time. Build + deploy
(`vercel --prod --yes`) after each phase per the standing deploy-on-each-change
rule, and verify with the curl checks listed in each phase before moving on.

Canonical host decision: **apex — `https://norvexsports.in`** (no www).

---

## PHASE 0 — Verify domain wiring (read-only, no code)

1. `vercel domains ls` / `vercel project inspect` → confirm `norvexsports.in`
   (and `www.norvexsports.in`) are attached to this project.
2. `curl -sI https://norvexsports.in/` → expect 200 from Vercel.
3. `curl -sI https://www.norvexsports.in/` → note whether it 307/308s to apex.
4. If the domain is NOT attached → STOP and tell the user to add it in the
   Vercel dashboard (Settings → Domains) before anything else.

## PHASE 1 — Canonical domain everywhere (THE BIG FIX)

The single highest-impact change. Currently prod `NEXT_PUBLIC_SITE_URL` is the
vercel.app URL, so every canonical/OG/sitemap/JSON-LD @id is wrong.

1. **Prod env var**: set `NEXT_PUBLIC_SITE_URL=https://norvexsports.in` in
   Vercel production env. CLI: `vercel env rm NEXT_PUBLIC_SITE_URL production`
   then `echo "https://norvexsports.in" | vercel env add NEXT_PUBLIC_SITE_URL production`.
   (User rejected `vercel env pull` earlier — do NOT pull envs; only rm/add
   this one var, or ask the user to change it in the dashboard.)
2. **Fix fallback bug**: `lib/settings.ts` → `siteUrl()` falls back to
   `https://norvexsports.com` (wrong TLD). Change to `https://norvexsports.in`.
3. **Grep sweep**: search repo for `vercel.app`, `norvexsports.com`, and any
   other hardcoded absolute self-URLs; fix all (skip `.git`, `node_modules`,
   SEO-GBP-SOCIAL-PLAYBOOK.md notes can be updated too).
4. **Host canonicalization middleware**: in `middleware.ts` (widen matcher or
   add logic before the admin guard):
   - If host is `www.norvexsports.in` or `norvex-sports.vercel.app` (any
     `*.vercel.app` PRODUCTION alias) → 308 redirect to same path on
     `https://norvexsports.in`.
   - EXCEPTION: do not redirect preview deployment URLs (host containing
     `-git-` or not the prod alias) — instead add response header
     `X-Robots-Tag: noindex, nofollow` so previews never index.
5. Build, deploy, then VERIFY:
   - `curl -s https://norvexsports.in/ | grep -o '<link rel="canonical"[^>]*'` → apex URL
   - `curl -sI https://norvex-sports.vercel.app/` → 308 → apex
   - `curl -s https://norvexsports.in/sitemap.xml | head` → apex URLs only
   - JSON-LD `@id`s on homepage contain `norvexsports.in`

## PHASE 2 — Sitemap / robots / feed hardening

1. Read `app/sitemap.ts` — ensure it includes ALL public routes: static pages,
   `/services/[slug]`, `/events/[slug]`, `/news/[slug]`, with `lastModified`
   from DB `updatedAt` where available, sensible `changeFrequency`/`priority`.
2. `app/robots.ts` — keep `/api/` disallowed, admin path NOT listed (already
   correct); sitemap absolute URL must resolve to apex.
3. `/feed.xml` — confirm item links use `siteUrl()` (apex).
4. Verify live: `robots.txt`, `sitemap.xml`, `feed.xml` all 200 on apex with
   correct URLs.

## PHASE 3 — Structured data completeness pass

Mostly built already (`lib/seo.ts` is strong). Close remaining gaps:

1. Confirm siteGraph (Organization + WebSite + LocalBusiness) renders on every
   page via the (site) layout — check `app/(site)/layout.tsx`.
2. LocalBusiness: add `openingHoursSpecification` — screenshot showed
   "Open · Closes 9pm" on GBP. ASK USER for exact daily hours; do not invent.
3. Add `geo`/`hasMap` consistency: main = Madinaguda (17.498302, 78.3443668,
   maps.app.goo.gl/9LNEixfVF1aYStFG7) — already done; keep venuesLd additive.
4. FAQ: `SITE_FAQ` + `faqLd()` exist — verify the FAQ is VISIBLY rendered on
   the page that emits FAQPage JSON-LD (Google requirement). If not rendered
   anywhere, add a FAQ accordion section (home or contact page) using the same
   SITE_FAQ source.
5. Do NOT fabricate: no AggregateRating, no reviews, no fake hours.

## PHASE 4 — AEO (Answer Engine Optimization) layer

Goal: be the answer ChatGPT/Claude/Perplexity/Google-AI give for
"football academy in Hyderabad".

1. **`/llms.txt`** (route handler or public file): concise markdown fact sheet —
   what Norvex Sports is, services list, both venue addresses, phone, email,
   booking URL, FAQ digest, link to sitemap. Keep it factual, from DB/settings
   where possible.
2. **AI crawler policy** in `app/robots.ts`: explicitly ALLOW `GPTBot`,
   `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `Google-Extended`, `Bingbot`,
   `CCBot` (user wants max AI visibility; allowing is the default `*` rule but
   explicit UA rules make intent unambiguous).
3. **IndexNow** (Bing/Yandex instant indexing): generate a key, serve
   `/<key>.txt` from public/, and add a tiny `lib/indexnow.ts` helper that
   pings `https://api.indexnow.org/indexnow` — call it (fire-and-forget) from
   admin actions that already call `revalidatePath` (news/events/services
   publish). Wrap in try/catch; never block the action.
4. **Speakable** — already in `webPageLd`; confirm selectors match real h1/h2.
5. **Q&A-shaped content**: ensure key pages have question-style h2s that match
   the FAQ (services page: "What programs does Norvex offer?" etc.) — light
   copy touch, keep existing design/tone.

## PHASE 5 — Metadata & asset polish

1. `manifest`/`site.webmanifest`: name, short_name, theme colour, icons OK.
2. OG image (`app/opengraph-image.tsx`) renders on apex; twitter card large.
3. Add `apple-touch-icon` if missing (public/ has only favicon.svg +
   logo png) — generate 180×180 PNG from the logo.
4. `hreflang` not needed (single locale en-IN) — skip.

## PHASE 6 — Off-site / USER-ACTION items (Opus prepares, user clicks)

Opus cannot do these alone — print clear instructions for the user:

1. **Google Search Console**: add DOMAIN property `norvexsports.in` (DNS TXT
   verification at the registrar), then submit `https://norvexsports.in/sitemap.xml`,
   request indexing for /, /services, /location, /events. If they instead use
   URL-prefix + meta tag: set `GOOGLE_SITE_VERIFICATION` env in Vercel (the
   layout already wires it).
2. **Bing Webmaster Tools**: "Import from GSC" one-click; IndexNow key from
   Phase 4 auto-registers.
3. **Google Business Profile**: website field → `https://norvexsports.in`;
   NAP must match site exactly (Madinaguda…500049). Add Kollur as an
   additional location/profile if it's a staffed venue.
4. Update Instagram/Facebook/LinkedIn/X/Threads bio links → norvexsports.in.
5. Optional: GA4 — set `NEXT_PUBLIC_GA_ID` in Vercel prod env.

## FINAL VERIFICATION CHECKLIST

- [ ] `curl -sI https://norvex-sports.vercel.app/` → 308 → `https://norvexsports.in/`
- [ ] `curl -sI https://www.norvexsports.in/` → 308 → apex (if www attached)
- [ ] Canonical on every page = apex URL (spot-check /, /services, /location, /events)
- [ ] `sitemap.xml`, `robots.txt`, `feed.xml`, `llms.txt` all 200 on apex
- [ ] Rich Results Test (user pastes https://norvexsports.in/) — Organization,
      LocalBusiness, FAQ, Breadcrumbs all detected, zero errors
- [ ] Admin panel still works on apex: `https://norvexsports.in/nvx-panel-7q2/login`
      → 200, guarded routes 307
- [ ] Old `/admin` still 404 on apex
- [ ] Location page venues + JSON-LD geo intact on apex
