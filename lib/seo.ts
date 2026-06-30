import type { Metadata } from 'next';
import { siteUrl, type SiteContent } from './settings';

/* ------------------------------------------------------------------ *
 * Central SEO facts — single source of truth for structured data,
 * canonical URLs, geo meta and breadcrumbs. Nothing here renders
 * visible page copy; it only powers metadata + JSON-LD for search
 * engines (Google, Bing) and local map listings.
 * ------------------------------------------------------------------ */

/** Verified location from the Google Business / Maps listing. */
export const GEO = { latitude: 17.498302, longitude: 78.3443668 } as const;

/** Public Google Maps short link (the "updated map"). */
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/72MA26SkbDdSHnPd8';

/** Canonical place URL (resolved from the short link). */
export const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Norvex+sports/@17.498302,78.3443668,17z';

export const FOUNDING_DATE = '2026';
export const LOCALE = 'en_IN';

/** Absolute URL for a same-origin path. */
export function abs(path: string): string {
  const base = siteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Per-page metadata factory: sets a correct self-referencing canonical
 * (fixes the default-to-homepage inheritance trap) plus matching
 * OpenGraph/Twitter URLs. Canonicals are relative so Next resolves them
 * against `metadataBase`.
 */
export function pageMeta(opts: {
  title?: string;
  description?: string;
  path: string;
  images?: string[];
  type?: 'website' | 'article';
}): Metadata {
  const { title, description, path, images, type = 'website' } = opts;
  const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '');
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: canonicalPath },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: canonicalPath,
      type,
      ...(images && images.length ? { images } : {}),
    },
    ...(images && images.length
      ? { twitter: { card: 'summary_large_image', images } }
      : {}),
  };
}

/** BreadcrumbList JSON-LD for a trail of {name, path} crumbs. */
export function breadcrumbLd(
  crumbs: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/**
 * Site-wide entity graph: Organization + WebSite + the physical
 * SportsActivityLocation/LocalBusiness, cross-linked by @id so search
 * engines treat them as one entity. Powers the local "knowledge panel"
 * and map pack.
 */
export function siteGraph(c: SiteContent): Array<Record<string, unknown>> {
  const url = siteUrl();
  const logoUrl = abs('/norvex_sports_logo.png');
  const ogUrl = abs('/opengraph-image');

  const sameAs = [
    c.social.instagram,
    c.social.facebook,
    c.social.linkedin,
    c.social.youtube,
    c.social.threads,
    c.social.x,
    GOOGLE_MAPS_PLACE_URL,
  ].filter(Boolean);

  const address = {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  };

  const logo = {
    '@type': 'ImageObject',
    '@id': `${url}/#logo`,
    url: logoUrl,
    contentUrl: logoUrl,
    caption: 'Norvex Sports',
  };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${url}/#organization`,
      name: 'Norvex Sports',
      alternateName: 'Norvex',
      url,
      logo,
      image: { '@id': `${url}/#logo` },
      description: c.aboutShort,
      email: c.contact.email,
      telephone: c.contact.phone,
      foundingDate: FOUNDING_DATE,
      slogan: c.tagline,
      address,
      areaServed: { '@type': 'City', name: 'Hyderabad' },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: c.contact.phone,
          email: c.contact.email,
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi', 'te'],
        },
      ],
      sameAs,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${url}/#website`,
      url,
      name: 'Norvex Sports',
      description: c.aboutShort,
      inLanguage: 'en-IN',
      publisher: { '@id': `${url}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': ['SportsActivityLocation', 'LocalBusiness'],
      '@id': `${url}/#localbusiness`,
      name: 'Norvex Sports',
      url,
      image: ogUrl,
      logo: logoUrl,
      description: c.aboutShort,
      sport: 'Football',
      telephone: c.contact.phone,
      email: c.contact.email,
      foundingDate: FOUNDING_DATE,
      parentOrganization: { '@id': `${url}/#organization` },
      address,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.latitude,
        longitude: GEO.longitude,
      },
      hasMap: GOOGLE_MAPS_URL,
      areaServed: [
        { '@type': 'City', name: 'Hyderabad' },
        { '@type': 'AdministrativeArea', name: 'Telangana' },
      ],
      knowsAbout: [
        'Football',
        'Football coaching',
        'Youth football development',
        'Soccer training',
        'Football trials',
        'Football tournaments',
      ],
      sameAs,
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Per-entity JSON-LD builders. Each cross-links back to the site
 * Organization/LocalBusiness by @id so search engines fold everything
 * into one knowledge graph. None of these render visible copy.
 * ------------------------------------------------------------------ */

/** PostalAddress reused across event/job structured data. */
const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Hyderabad',
  addressRegion: 'Telangana',
  addressCountry: 'IN',
} as const;

const AREA_SERVED = [
  { '@type': 'City', name: 'Hyderabad' },
  { '@type': 'AdministrativeArea', name: 'Telangana' },
];

/** Service detail → schema.org/Service, provider linked to the org. */
export function serviceLd(s: {
  slug: string;
  title: string;
  shortDesc: string;
  metaDescription?: string | null;
  imageUrl?: string | null;
}): Record<string, unknown> {
  const base = siteUrl();
  const url = `${base}/services/${s.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: s.title,
    description: s.metaDescription || s.shortDesc,
    serviceType: s.title,
    category: 'Football coaching',
    url,
    ...(s.imageUrl ? { image: [s.imageUrl] } : {}),
    provider: { '@id': `${base}/#organization` },
    areaServed: AREA_SERVED,
    audience: { '@type': 'Audience', audienceType: 'Footballers — youth and adults' },
  };
}

/** Events list → embeddable Service-less Event node for a detail page. */
export function eventLd(e: {
  slug: string;
  title: string;
  summary: string;
  metaDescription?: string | null;
  date?: Date | null;
  location?: string | null;
  imageUrl?: string | null;
  category?: string | null;
}): Record<string, unknown> {
  const base = siteUrl();
  const url = `${base}/events/${e.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name: e.title,
    description: e.metaDescription || e.summary,
    url,
    ...(e.date ? { startDate: e.date.toISOString() } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(e.category ? { keywords: e.category } : {}),
    location: {
      '@type': 'Place',
      name: e.location || 'Norvex Sports — Hyderabad',
      address: POSTAL_ADDRESS,
      geo: { '@type': 'GeoCoordinates', latitude: GEO.latitude, longitude: GEO.longitude },
    },
    ...(e.imageUrl ? { image: [e.imageUrl] } : {}),
    organizer: { '@type': 'Organization', name: 'Norvex Sports', url: base, '@id': `${base}/#organization` },
    performer: { '@type': 'Organization', name: 'Norvex Sports' },
  };
}

const EMPLOYMENT_TYPE: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  contractor: 'CONTRACTOR',
  internship: 'INTERN',
  intern: 'INTERN',
  temporary: 'TEMPORARY',
  volunteer: 'VOLUNTEER',
};

/** Careers → schema.org/JobPosting (Google for Jobs eligible). */
export function jobPostingLd(job: {
  title: string;
  description: string;
  type?: string | null;
  location?: string | null;
  createdAt?: Date | null;
  applyUrl?: string | null;
}): Record<string, unknown> {
  const base = siteUrl();
  const empType = job.type ? EMPLOYMENT_TYPE[job.type.toLowerCase().trim()] : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    ...(job.createdAt ? { datePosted: job.createdAt.toISOString().slice(0, 10) } : {}),
    ...(empType ? { employmentType: empType } : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Norvex Sports',
      sameAs: base,
      logo: abs('/norvex_sports_logo.png'),
    },
    jobLocation: {
      '@type': 'Place',
      address: { ...POSTAL_ADDRESS, addressLocality: job.location || 'Hyderabad' },
    },
    ...(job.applyUrl ? { url: job.applyUrl } : {}),
  };
}

/** Team → ItemList of Person nodes (E-E-A-T signal). */
export function teamListLd(
  members: Array<{ name: string; role: string; bio?: string | null; imageUrl?: string | null }>,
): Record<string, unknown> {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Norvex Sports — Core Team',
    url: abs('/team'),
    itemListElement: members.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        worksFor: { '@id': `${base}/#organization` },
        ...(m.imageUrl ? { image: m.imageUrl } : {}),
        ...(m.bio ? { description: m.bio } : {}),
      },
    })),
  };
}

/** Gallery → schema.org/ImageGallery with up to 50 ImageObjects. */
export function galleryLd(
  items: Array<{ imageUrl: string; title?: string | null; caption?: string | null }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Norvex Sports — Gallery',
    url: abs('/gallery'),
    isPartOf: { '@id': `${siteUrl()}/#website` },
    ...(items.length
      ? {
          associatedMedia: items.slice(0, 50).map((g) => ({
            '@type': 'ImageObject',
            contentUrl: g.imageUrl,
            ...(g.title ? { name: g.title } : {}),
            ...(g.caption ? { caption: g.caption } : {}),
          })),
        }
      : {}),
  };
}

/** News index → CollectionPage wrapping an ItemList of posts. */
export function newsListLd(
  posts: Array<{ slug: string; title: string }>,
): Record<string, unknown> {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Norvex Sports — News & Updates',
    url: abs('/news'),
    isPartOf: { '@id': `${base}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((n, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/news/${n.slug}`,
        name: n.title,
      })),
    },
  };
}
