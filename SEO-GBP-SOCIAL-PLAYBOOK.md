# Norvex Sports — Off-Site SEO Playbook (Google Business Profile + Social)

This is the copy-paste-ready action list for everything that lives **outside the codebase** —
Google Business Profile (GBP), Bing Places, and the social platforms. The website schema now
declares all of these as the business's official profiles (`sameAs`), so the job here is to make
each profile **consistent** with the site so Google folds them into one entity/knowledge panel.

> Golden rule — **NAP consistency.** Name, Address, Phone must be *character-for-character identical*
> everywhere. Inconsistent NAP is the #1 thing that suppresses local ranking.

---

## 0. The canonical business facts (use these verbatim)

| Field | Value |
|---|---|
| **Name** | Norvex Sports |
| **Category (primary)** | Football club / Sports club / Sports coaching |
| **Phone** | +91 80899 20562 |
| **WhatsApp** | https://wa.me/918089920562 |
| **Email** | admin@norvexsports.in |
| **Careers email** | hr@norvexsports.in |
| **Website** | https://norvexsports.com  *(confirm the live domain matches `NEXT_PUBLIC_SITE_URL`)* |
| **City / Region** | Hyderabad, Telangana, India |
| **Google Maps** | https://maps.app.goo.gl/72MA26SkbDdSHnPd8 |
| **Founded** | 2026 |

**Official profiles (must match the site's `sameAs`):**
- Instagram: https://www.instagram.com/norvexsports
- Facebook: https://www.facebook.com/share/1B2MxrehXu/
- LinkedIn: https://www.linkedin.com/company/norvex-sports/
- Threads: https://www.threads.com/@norvexsports
- X (Twitter): https://x.com/NORVEXSPORTS
- YouTube: *(create + add — currently blank in the site settings)*

---

## 1. Google Business Profile (highest priority)

Manage at **https://business.google.com**. This is what powers the map pack and the knowledge panel.

### 1a. Categories
- **Primary:** `Football club` (or `Sports club` if unavailable)
- **Additional:** `Sports coaching`, `Football camp`, `Sports school`, `Association / organization`

### 1b. Business description (750 char max — paste this)
```
Norvex Sports is a professional football development academy in Hyderabad, Telangana.
Founded in 2026, we provide structured coaching for every level — grassroots beginners,
youth development, advanced players and adults. Programs include football development,
one-to-one and community coaching, advanced player development, adult training, tournament
and event organisation, school and college coaching, fitness and conditioning, and talent
identification trials. We run leagues, clinics, open trials and the Norvex Youth League, plus
football-themed birthday parties. Book a free trial today — just bring your boots.
```

### 1c. Services (add each as a GBP "Service" with a short description)
1. Football Development Program
2. One-to-One & Community Coaching
3. Advanced Player Development
4. Adult Football Training
5. Tournament & Event Organization
6. School & College Coaching
7. Fitness & Conditioning
8. Talent Identification & Trials

*(These mirror the site's Services — keep the names identical to the site.)*

### 1d. Attributes to switch on
- Identifies as: (as applicable)
- Offerings: Free trial / Free consultation
- Amenities / Accessibility: as true
- Payments: UPI, Cash, Card, Bank transfer *(matches the `paymentAccepted` schema)*
- Appointment/booking link → `https://norvexsports.com/contact#trial?utm_source=gbp&utm_medium=organic&utm_campaign=booking`

### 1e. Hours
Set your **real** training/office hours. (The site schema intentionally does **not** hard-code hours
to avoid publishing wrong ones — GBP is the source of truth. If you want hours in the site schema too,
tell me the exact hours and I'll wire `openingHoursSpecification` into `lib/seo.ts`.)

### 1f. Photos (upload weekly)
Logo, cover, training sessions, match day, team, facilities, coaches, kids training, celebrations.
Name the files descriptively before upload, e.g. `norvex-sports-football-training-hyderabad.jpg`.

### 1g. GBP Posts (ongoing — post 1–2×/week)
Use the "What's new / Offer / Event" post types for trials, league fixtures, open-trial dates, clinics.
Always add the booking button pointing at `/contact#trial` with the UTM above.

### 1h. Reviews (do NOT fake — Google penalises this)
- Share this review link with real players/parents: open your GBP → "Ask for reviews" → copy the short link.
- Reply to **every** review (good or bad) within 48h. Reviews + replies are a top-3 local ranking factor.
- The site schema deliberately omits `aggregateRating`/`review` because inventing ratings violates Google's
  guidelines and gets structured data ignored. Once you have genuine Google reviews, they surface via GBP.

---

## 2. Bing Places
Mirror the GBP setup at **https://www.bingplaces.com** (you can often import directly from Google).
Same NAP, categories, description, photos.

---

## 3. Social platforms — bio + link consistency

For **every** platform, set: profile name `Norvex Sports`, the same logo, city `Hyderabad, India`,
website link (UTM-tagged, below), and a bio drawn from the copy blocks here.

### Universal short bio (Instagram/Threads/X — ~150 char)
```
⚽ Football Development Academy · Hyderabad
Grassroots → Elite | Coaching · Leagues · Trials
Book a FREE trial 👇
```

### Longer bio (Facebook/LinkedIn "About")
```
Norvex Sports is a professional football development academy in Hyderabad, founded in 2026.
We coach players from grassroots to elite through structured training, one-to-one coaching,
leagues, trials and tournaments. Discipline. Consistency. Development. Book a free trial.
```

### Per-platform link (use UTMs so GA attributes the traffic)
| Platform | Link to put in bio |
|---|---|
| Instagram | `https://norvexsports.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Facebook | `https://norvexsports.com/?utm_source=facebook&utm_medium=social&utm_campaign=bio` |
| LinkedIn | `https://norvexsports.com/?utm_source=linkedin&utm_medium=social&utm_campaign=bio` |
| Threads | `https://norvexsports.com/?utm_source=threads&utm_medium=social&utm_campaign=bio` |
| X | `https://norvexsports.com/?utm_source=x&utm_medium=social&utm_campaign=bio` |
| YouTube | `https://norvexsports.com/?utm_source=youtube&utm_medium=social&utm_campaign=bio` |

### Handle / hashtag consistency
- Handle everywhere: `@norvexsports` (X uses `@NORVEXSPORTS`).
- Branded hashtags: `#NorvexSports #NorvexYouthLeague`
- Local/topic hashtags: `#HyderabadFootball #FootballAcademyHyderabad #GrassrootsFootball #FootballTrials`

### YouTube (create it — currently empty)
1. Create the channel as **Norvex Sports**, upload the logo + a banner.
2. Add the website link + all socials in "Links".
3. Once live, send me the URL and I'll add it to the site's social settings so it flows into `sameAs`.

---

## 4. Cross-linking (closes the entity loop)
- Site → socials: already done (footer + `sameAs` schema). ✅
- Each social profile → website (UTM links above). ← do this
- Each social profile → the others where the platform allows (e.g. link-in-bio / Linktree).
- GBP → website + booking link. ← do this

When Google sees the site declaring these profiles **and** each profile linking back with matching NAP,
it confirms they're one entity → stronger knowledge panel + local pack ranking.

---

## 5. Submit + monitor (one-time, then check monthly)
1. **Google Search Console** (https://search.google.com/search-console) — add the property, verify with
   `GOOGLE_SITE_VERIFICATION` env var (the site already reads it), submit `https://norvexsports.com/sitemap.xml`.
2. **Bing Webmaster Tools** — add site, import from GSC, submit the same sitemap.
3. Use GSC **URL Inspection → Request indexing** for the homepage, `/services`, `/contact`, `/events`.
4. Validate structured data: **https://search.google.com/test/rich-results** — test `/`, `/contact`
   (FAQ), `/services`, an event, a news post, `/careers` (JobPosting), `/team`.
5. Re-check quarterly and after any content change.

---

## 6. What was done in code (so you don't duplicate it)
- Entity graph: Organization + WebSite + SportsActivityLocation/LocalBusiness, cross-linked by `@id`.
- **New:** `hasOfferCatalog` + `makesOffer` on the business (built from live services), `ReserveAction`
  booking action, `priceRange`, `currenciesAccepted`, `paymentAccepted`, WhatsApp contact point,
  expanded `knowsAbout`, master keyword set on every page.
- **New:** `FAQPage` schema + visible FAQ on `/contact` (rich-result eligible).
- Per-entity schema for Service, Event, JobPosting, Team (Person list), Gallery, News (NewsArticle),
  Breadcrumbs — all present.
- `sitemap.xml` (with images) + `robots.txt` + canonical URLs + geo meta + OpenGraph/Twitter cards.

**Still needs a human (only you can do these):** claim/verify GBP, create YouTube, add real reviews,
set real opening hours, and submit to Search Console/Bing. Everything above is the exact copy to use.
