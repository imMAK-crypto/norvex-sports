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

/** Public Google Maps short link for the main academy (Madinaguda). */
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/9LNEixfVF1aYStFG7';

/** Canonical place URL (resolved from the short link). */
export const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Norvex+sports+Football+Academy/@17.498302,78.3443668,17z';

/** Verified street address of the main academy — single source of truth. */
export const MAIN_ADDRESS = {
  streetAddress: 'Madinaguda, Shanti Nagar Colony, Deepthisri Nagar',
  addressLocality: 'Hyderabad',
  addressRegion: 'Telangana',
  postalCode: '500049',
  addressCountry: 'IN',
} as const;

export const FOUNDING_DATE = '2026';
export const LOCALE = 'en_IN';

/**
 * Master keyword set — the terms Norvex should rank for. Reused across the
 * Organization/LocalBusiness schema and available for per-page metadata.
 */
export const ORG_KEYWORDS: string[] = [
  'football academy Hyderabad',
  'football coaching Hyderabad',
  'football training Hyderabad',
  'soccer academy Hyderabad',
  'youth football Hyderabad',
  'kids football training Hyderabad',
  'football classes near me',
  'football coaching near me',
  'football academy near me',
  'grassroots football India',
  'football trials Hyderabad',
  'football tournament Hyderabad',
  'one to one football coaching',
  'adult football training Hyderabad',
  'football fitness and conditioning',
  'school football coaching',
  'talent identification football',
  'football development program',
  'Norvex Sports',
  'best football academy in Hyderabad',
];

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
  keywords?: string[];
}): Metadata {
  const { title, description, path, images, type = 'website', keywords } = opts;
  const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '');
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: { canonical: canonicalPath },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: canonicalPath,
      type,
      siteName: 'Norvex Sports',
      locale: 'en_IN',
      ...(images && images.length ? { images } : {}),
    },
    // Always carry the @NORVEXSPORTS handle so X/Twitter cards attribute to the
    // brand on every page — Next.js replaces (does not deep-merge) the parent
    // `twitter` object when a route sets its own, so the handle must be repeated.
    twitter: {
      card: 'summary_large_image',
      site: '@NORVEXSPORTS',
      creator: '@NORVEXSPORTS',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(images && images.length ? { images } : {}),
    },
  };
}

/** BreadcrumbList JSON-LD for a trail of {name, path} crumbs. */
export function breadcrumbLd(
  crumbs: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  const last = crumbs[crumbs.length - 1];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // Stable @id keyed on the current page so WebPage nodes can cross-link it.
    '@id': `${abs(last.path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/**
 * Per-page WebPage-family node (WebPage / AboutPage / ContactPage /
 * CollectionPage / ProfilePage). Anchors each URL into the entity graph:
 * isPartOf the WebSite, about the Organization, links its breadcrumb, marks
 * the primary image, and flags speakable regions for voice search. No visible
 * copy — pure structured data.
 */
export function webPageLd(opts: {
  path: string;
  name: string;
  description?: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ProfilePage';
  image?: string | null;
  hasBreadcrumb?: boolean;
  dateModified?: string;
  datePublished?: string;
  speakableSelectors?: string[];
}): Record<string, unknown> {
  const base = siteUrl();
  const { path, name, description, type = 'WebPage', image, hasBreadcrumb = true } = opts;
  const canonical = path === '/' ? base : `${base}${path.replace(/\/$/, '')}`;
  const primaryImage = image ? abs(image) : abs('/opengraph-image');
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': `${base}/#website` },
    about: { '@id': `${base}/#organization` },
    inLanguage: 'en-IN',
    primaryImageOfPage: { '@type': 'ImageObject', url: primaryImage },
    ...(hasBreadcrumb ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: opts.speakableSelectors ?? ['h1', 'h2'],
    },
  };
}

/**
 * Service detail → Course / EducationalOccupationalProgram, so training
 * programs are eligible for course-style rich results. Complements serviceLd
 * (the same page carries both a Service and a Course node).
 */
export function courseLd(s: {
  slug: string;
  title: string;
  shortDesc: string;
  longDesc?: string | null;
  metaDescription?: string | null;
  imageUrl?: string | null;
}): Record<string, unknown> {
  const base = siteUrl();
  const url = `${base}/services/${s.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: s.title,
    description: s.metaDescription || s.longDesc || s.shortDesc,
    url,
    ...(s.imageUrl ? { image: [s.imageUrl] } : {}),
    provider: { '@id': `${base}/#organization` },
    educationalLevel: 'Beginner to Advanced',
    inLanguage: 'en-IN',
    about: 'Football training',
    teaches: s.title,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['Onsite', 'InPerson'],
      courseWorkload: 'Ongoing sessions',
      location: {
        '@type': 'Place',
        name: 'Norvex Sports — Hyderabad',
        address: POSTAL_ADDRESS,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${base}/contact#trial`,
        category: 'Football coaching',
      },
    },
  };
}

/** Gallery video reel → schema.org/VideoObject (video rich results). */
export function videoLd(v: {
  title?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  uploadDate?: Date | null;
}): Record<string, unknown> {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title || 'Norvex Sports — In Action',
    description: 'Highlights from Norvex Sports football training, matches and events in Hyderabad.',
    thumbnailUrl: v.thumbnailUrl ? [v.thumbnailUrl] : [abs('/opengraph-image')],
    uploadDate: (v.uploadDate ?? new Date()).toISOString(),
    contentUrl: v.url,
    embedUrl: v.url,
    publisher: { '@id': `${base}/#organization` },
  };
}

/**
 * Site-wide entity graph: Organization + WebSite + the physical
 * SportsActivityLocation/LocalBusiness, cross-linked by @id so search
 * engines treat them as one entity. Powers the local "knowledge panel"
 * and map pack.
 */
export function siteGraph(
  c: SiteContent,
  services?: Array<{ slug: string; title: string; shortDesc?: string | null }>,
): Array<Record<string, unknown>> {
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

  // Real service catalogue → Offer nodes, so the business entity is linked to
  // everything it actually sells. Built only from active services (no fabrication).
  const offerCatalog =
    services && services.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Football Training Programs & Services',
            itemListElement: services.map((s) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                '@id': `${url}/services/${s.slug}#service`,
                name: s.title,
                ...(s.shortDesc ? { description: s.shortDesc } : {}),
                url: `${url}/services/${s.slug}`,
                serviceType: 'Football coaching',
                provider: { '@id': `${url}/#organization` },
              },
              category: 'Football coaching',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'INR',
            })),
          },
          makesOffer: services.map((s) => ({
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            itemOffered: { '@id': `${url}/services/${s.slug}#service` },
          })),
        }
      : {};

  // Booking CTA search engines can surface as an action.
  const bookAction = {
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Book a Free Trial',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/contact#trial`,
        inLanguage: 'en-IN',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'Reservation', name: 'Football trial session' },
    },
  };

  const whatsappNumber = c.contact.whatsapp
    ? `+${c.contact.whatsapp.replace(/[^\d]/g, '')}`
    : c.contact.phone;

  const address = {
    '@type': 'PostalAddress',
    ...MAIN_ADDRESS,
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
      alternateName: ['Norvex', 'Norvex Sports Football Academy', 'Norvex Sports Academy', 'Norvex Football Academy'],
      url,
      logo,
      image: { '@id': `${url}/#logo` },
      description: c.aboutShort,
      email: c.contact.email,
      telephone: c.contact.phone,
      foundingDate: FOUNDING_DATE,
      foundingLocation: { '@type': 'Place', name: 'Hyderabad, Telangana, India' },
      slogan: c.tagline,
      keywords: ORG_KEYWORDS,
      knowsLanguage: ['en', 'hi', 'te'],
      address,
      areaServed: AREA_SERVED,
      ...offerCatalog,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: c.contact.phone,
          email: c.contact.email,
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi', 'te'],
        },
        {
          '@type': 'ContactPoint',
          telephone: whatsappNumber,
          contactType: 'sales',
          contactOption: 'https://schema.org/TollFree',
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
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI, Bank Transfer, Card',
      slogan: c.tagline,
      keywords: ORG_KEYWORDS,
      parentOrganization: { '@id': `${url}/#organization` },
      address,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.latitude,
        longitude: GEO.longitude,
      },
      hasMap: GOOGLE_MAPS_URL,
      areaServed: AREA_SERVED,
      ...offerCatalog,
      ...bookAction,
      knowsAbout: [
        'Football',
        'Football coaching',
        'Football academy',
        'Youth football development',
        'Grassroots football',
        'Soccer training',
        'Football trials',
        'Football tournaments',
        'One-to-one football coaching',
        'Fitness and conditioning',
        'Talent identification',
        'School football programs',
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
  ...MAIN_ADDRESS,
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

/**
 * Site FAQ — single source of truth for both the visible accordion and the
 * FAQPage JSON-LD. Google only grants FAQ rich results when the same Q&A is
 * visible on the page, so this feeds the rendered section too.
 */
export const SITE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where is Norvex Sports located?',
    a: 'Norvex Sports is a professional football development academy based in Hyderabad, Telangana, India. We run training, leagues, trials and tournaments across the city.',
  },
  {
    q: 'What age groups do you coach?',
    a: 'We coach players across all age groups — from young grassroots beginners through youth development to adult football training. Programs are organised into clear age- and skill-banded stages.',
  },
  {
    q: 'Do you offer a free trial session?',
    a: 'Yes. Your first session is on us — just bring your boots. You can book a free trial from our Contact page, by phone, or on WhatsApp.',
  },
  {
    q: 'What programs and services does Norvex Sports offer?',
    a: 'Football development programs, one-to-one and community coaching, advanced player development, adult football training, tournament and event organization, school and college coaching, fitness and conditioning, and talent identification trials.',
  },
  {
    q: 'How do I join or register for training?',
    a: 'Submit an enquiry through the Contact page or message us on WhatsApp. Our team responds within one working day to arrange your free trial and confirm the right program for you.',
  },
  {
    q: 'Do you organise football tournaments and events?',
    a: 'Yes. We plan and run tournaments, leagues, clinics and open trials — including the Norvex Youth League — plus football-themed birthday parties.',
  },
  {
    q: 'Do you provide one-to-one coaching?',
    a: 'Yes. Alongside group programs we offer personalised one-to-one sessions focused on a specific position, skill set or area for improvement.',
  },
];

/** FAQPage JSON-LD built from a list of Q&A pairs. */
export function faqLd(
  items: Array<{ q: string; a: string }> = SITE_FAQ,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl()}/#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * Split a free-text venue address into a schema.org PostalAddress. Pulls the
 * 6-digit Indian PIN, strips the city/state/PIN tail off the street portion,
 * and defaults locality/region/country to Hyderabad/Telangana/IN.
 */
export function toPostalAddress(address?: string | null): Record<string, unknown> {
  const a = (address ?? '').trim();
  const postalCode = a.match(/\b(\d{6})\b/)?.[1];
  const street = a
    .replace(/,?\s*\b\d{6}\b/g, '')
    .replace(/,?\s*\bTelangana\b/gi, '')
    .replace(/,?\s*\bHyderabad\b/gi, '')
    .replace(/,?\s*\bIndia\b/gi, '')
    .replace(/[,\s]+$/, '')
    .trim();
  return {
    '@type': 'PostalAddress',
    ...(street ? { streetAddress: street } : {}),
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    ...(postalCode ? { postalCode } : {}),
    addressCountry: 'IN',
  };
}

/**
 * Location page → ItemList of the academy's physical training venues as
 * SportsActivityLocation Places. Each carries a full PostalAddress, the real
 * Google Maps link (hasMap) and precise geo when known, and is tied back to the
 * Organization. Purely additive local-SEO signal — it does not touch the
 * verified primary business entity in siteGraph().
 */
export function venuesLd(
  venues: Array<{
    id: string;
    name: string;
    address?: string | null;
    mapUrl: string;
    lat?: number | null;
    lng?: number | null;
    isPrimary?: boolean;
  }>,
): Record<string, unknown> | null {
  if (!venues.length) return null;
  const base = siteUrl();
  const locationUrl = abs('/location');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${locationUrl}#venues`,
    name: 'Norvex Sports — Training Venues',
    url: locationUrl,
    numberOfItems: venues.length,
    itemListElement: venues.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': ['SportsActivityLocation', 'Place'],
        '@id': `${locationUrl}#venue-${v.id}`,
        name: v.name,
        sport: 'Football',
        address: toPostalAddress(v.address),
        hasMap: v.mapUrl,
        ...(typeof v.lat === 'number' && typeof v.lng === 'number'
          ? { geo: { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng } }
          : {}),
        containedInPlace: { '@type': 'City', name: 'Hyderabad' },
        parentOrganization: { '@id': `${base}/#organization` },
        ...(v.isPrimary ? { additionalType: 'https://schema.org/SportsActivityLocation' } : {}),
      },
    })),
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
