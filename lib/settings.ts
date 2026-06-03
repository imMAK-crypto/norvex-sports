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
    email: 'support@norvexsports.in',
    whatsapp: '918089920562',
    location: 'Hyderabad, Telangana, India',
    careersEmail: 'careers@norvexsports.in',
  },
  social: {
    instagram: 'https://www.instagram.com/norvexsports?igsh=MXVtOXEwdmFwb3B2YQ==',
    facebook: 'https://www.facebook.com/share/1B2MxrehXu/',
    linkedin: 'https://www.linkedin.com/company/norvex-sports/',
    youtube: '',
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
      },
    };
  } catch {
    return DEFAULTS;
  }
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://norvexsports.com';
}
