import { prisma } from './prisma';

export type SiteContent = {
  tagline: string;
  aboutShort: string;
  aboutLong: string;
  projectStatement: string;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    location: string;
    careersEmail: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
    threads: string;
    x: string;
  };
};

const DEFAULTS: SiteContent = {
  tagline: 'Football Development. Done Professionally.',
  aboutShort:
    'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform.',
  aboutLong:
    'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform dedicated to nurturing players through structured functional training and expert coaching.',
  projectStatement:
    'At Norvex Sports, our project is to create a structured and professional environment where athletes can develop their skills, confidence, and overall performance.',
  contact: {
    phone: '+91 80899 20562',
    email: 'admin@norvexsports.in',
    whatsapp: '918089920562',
    location: 'Hyderabad, Telangana, India',
    careersEmail: 'hr@norvexsports.in',
  },
  social: {
    instagram: 'https://www.instagram.com/norvexsports?igsh=MXVtOXEwdmFwb3B2YQ==',
    facebook: 'https://www.facebook.com/share/1B2MxrehXu/',
    linkedin: 'https://www.linkedin.com/company/norvex-sports/',
    youtube: '',
    threads: 'https://www.threads.com/@norvexsports',
    x: 'https://x.com/NORVEXSPORTS',
  },
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const get = (k: string, fallback: string) => map.get(k) ?? fallback;
    return {
      tagline: get('site.tagline', DEFAULTS.tagline),
      aboutShort: get('site.aboutShort', DEFAULTS.aboutShort),
      aboutLong: get('site.aboutLong', DEFAULTS.aboutLong),
      projectStatement: get('site.projectStatement', DEFAULTS.projectStatement),
      contact: {
        phone: get('contact.phone', DEFAULTS.contact.phone),
        email: get('contact.email', DEFAULTS.contact.email),
        whatsapp: get('contact.whatsapp', DEFAULTS.contact.whatsapp),
        location: get('contact.location', DEFAULTS.contact.location),
        careersEmail: get('contact.careersEmail', DEFAULTS.contact.careersEmail),
      },
      social: {
        instagram: get('social.instagram', DEFAULTS.social.instagram),
        facebook: get('social.facebook', DEFAULTS.social.facebook),
        linkedin: get('social.linkedin', DEFAULTS.social.linkedin),
        youtube: get('social.youtube', DEFAULTS.social.youtube),
        threads: get('social.threads', DEFAULTS.social.threads),
        x: get('social.x', DEFAULTS.social.x),
      },
    };
  } catch {
    return DEFAULTS;
  }
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.norvexsports.in';
}

/* ------------------------------------------------------------------ *
 * Home page editable content (hero, stats, values, about) — backed by
 * SiteSetting keys so the admin Page Editor can change every block.
 * ------------------------------------------------------------------ */

export type StatItem = { num: string; label: string };
export type ValueItem = { name: string; desc: string; icon?: string };

export type HomeContent = {
  hero: {
    image: string;
    imageAlt: string;
    eyebrow: string;
    headline: string; // newline-separated lines; *word* = brand-coloured
    sub: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  about: { title: string; image: string; linkLabel: string };
  stats: StatItem[];
  values: ValueItem[];
};

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    image: '/images/home_hero.webp',
    imageAlt: 'Young footballers lined up on the pitch',
    eyebrow: "Hyderabad's Premier Football Academy",
    headline: 'Build Your\n*Future.*\nNever Limit.\nNever *Settle.*',
    sub: 'Structured pathways from grassroots to elite — expert coaching, competitive exposure, and a culture built on discipline and consistency.',
    primaryCtaLabel: 'Book a Free Trial',
    primaryCtaHref: '/contact#trial',
    secondaryCtaLabel: 'Our Programs',
    secondaryCtaHref: '/services',
  },
  about: {
    title: 'More than training.',
    image: '/images/home_more_than_training.webp',
    linkLabel: 'Read Our Story',
  },
  stats: [
    { num: '8+', label: 'Programs' },
    { num: '10+', label: 'Events' },
    { num: '10×', label: 'Fun & Intensity' },
    { num: '5★', label: 'Pro Coaching' },
  ],
  values: [
    { name: 'Discipline', desc: 'Discipline & Consistency', icon: 'shield' },
    { name: 'Development', desc: 'Prioritizing Athlete Development', icon: 'activity' },
    { name: 'Integrity', desc: 'Professionalism & Integrity', icon: 'award' },
    { name: 'Teamwork', desc: 'Teamwork & Respect', icon: 'users' },
    { name: 'Inclusion', desc: 'Sports for Everyone', icon: 'heart' },
  ],
};

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) || typeof v === 'object' ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'home.' } } });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const g = (k: string, fb: string) => map.get(k) ?? fb;
    const d = HOME_DEFAULTS;
    return {
      hero: {
        image: g('home.hero.image', d.hero.image),
        imageAlt: g('home.hero.imageAlt', d.hero.imageAlt),
        eyebrow: g('home.hero.eyebrow', d.hero.eyebrow),
        headline: g('home.hero.headline', d.hero.headline),
        sub: g('home.hero.sub', d.hero.sub),
        primaryCtaLabel: g('home.hero.primaryCtaLabel', d.hero.primaryCtaLabel),
        primaryCtaHref: g('home.hero.primaryCtaHref', d.hero.primaryCtaHref),
        secondaryCtaLabel: g('home.hero.secondaryCtaLabel', d.hero.secondaryCtaLabel),
        secondaryCtaHref: g('home.hero.secondaryCtaHref', d.hero.secondaryCtaHref),
      },
      about: {
        title: g('home.about.title', d.about.title),
        image: g('home.about.image', d.about.image),
        linkLabel: g('home.about.linkLabel', d.about.linkLabel),
      },
      stats: parseJson<StatItem[]>(map.get('home.stats'), d.stats),
      values: parseJson<ValueItem[]>(map.get('home.values'), d.values),
    };
  } catch {
    return HOME_DEFAULTS;
  }
}

/** Misc single-key settings (whatsapp fab, map embed, logo). */
export async function getMiscSetting(key: string, fallback = ''): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ *
 * Per-page editable copy (headers, intros, map embeds) — backed by
 * SiteSetting keys so the admin "Pages" editors can change every block.
 * Every key has a default here so the live site renders correctly even
 * before the row is seeded.
 * ------------------------------------------------------------------ */

export const PAGE_DEFAULTS: Record<string, string> = {
  // About page
  'about.eyebrow': 'About us',
  'about.title': 'Built for the football journey.',
  'about.intro': 'Founded in 2026 in Hyderabad — structured training, expert coaching, and a culture built on discipline.',
  'about.image': '/images/about_page.webp',

  // The Norvex Project page
  'norvex.eyebrow': 'Our vision',
  'norvex.title': 'The Norvex Project',
  'norvex.intro': 'A structured, professional environment where athletes can develop their skills, confidence and overall performance.',

  // Careers page
  'careers.eyebrow': 'Careers',
  'careers.title': 'Build the game with us.',
  'careers.intro': "We're always looking for people who share the Norvex philosophy of dedication, discipline and professionalism.",
  'careers.body':
    'At Norvex Sports, we are always looking for passionate, dedicated, and growth-driven individuals who want to be part of a dynamic sports development environment. As we continue to grow, we aim to build a strong team committed to professionalism, innovation, and player development both on and off the field.',

  // Contact page
  'contact.eyebrow': 'Contact us',
  'contact.title': 'Start your football journey.',
  'contact.intro': 'Free trial available. Drop us a line and our team will get back to you within one working day.',
  'contact.responseTime': 'Within 24 hours',

  // Location page
  'location.eyebrow': 'Our location',
  'location.title': 'Built in Hyderabad.',
  'location.intro':
    'Currently based in Hyderabad, Telangana — building a strong football development ecosystem. As we grow, we plan to expand to multiple locations and cities.',
  'location.mapEmbed': 'https://www.google.com/maps?q=Hyderabad,Telangana&output=embed',
  'location.outroTitle': 'Expanding outward.',
  'location.outro':
    'As we grow, we plan to expand our presence to multiple locations and cities — bringing structured sports development programs to a wider community of athletes across India.',
};

/** Every settings key the admin Page editors are allowed to write. */
export const EDITABLE_PAGE_KEYS: string[] = [
  // shared site content surfaced through the page editors
  'site.tagline',
  'site.aboutShort',
  'site.aboutLong',
  'site.projectStatement',
  'contact.phone',
  'contact.email',
  'contact.whatsapp',
  'contact.location',
  'contact.careersEmail',
  // home blocks
  'home.hero.image',
  'home.hero.imageAlt',
  'home.hero.eyebrow',
  'home.hero.headline',
  'home.hero.sub',
  'home.hero.primaryCtaLabel',
  'home.hero.primaryCtaHref',
  'home.hero.secondaryCtaLabel',
  'home.hero.secondaryCtaHref',
  'home.about.title',
  'home.about.image',
  'home.about.linkLabel',
  'home.stats',
  'home.values',
  // per-page copy
  ...Object.keys(PAGE_DEFAULTS),
];

/**
 * Batch-read a set of SiteSetting keys, falling back to PAGE_DEFAULTS where a
 * row hasn't been saved yet. Returns a flat key→value record.
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const k of keys) if (k in PAGE_DEFAULTS) out[k] = PAGE_DEFAULTS[k];
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    for (const r of rows) out[r.key] = r.value;
  } catch {
    /* DB unavailable — defaults already populated above */
  }
  return out;
}
