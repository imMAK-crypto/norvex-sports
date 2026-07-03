import { prisma, safeQuery } from '@/lib/prisma';
import { getSiteContent, siteUrl } from '@/lib/settings';
import { getVenues } from '@/lib/venue';
import { SITE_FAQ } from '@/lib/seo';

export const revalidate = 3600; // refresh hourly

/**
 * llms.txt — a concise, factual markdown brief for AI/answer engines
 * (ChatGPT, Claude, Perplexity, Google AI). Everything here is sourced from
 * the same DB/settings that power the visible site — no fabrication.
 * Spec: https://llmstxt.org
 */
export async function GET() {
  const base = siteUrl();
  const [c, services, venues] = await Promise.all([
    getSiteContent(),
    safeQuery(
      () =>
        prisma.service.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: { slug: true, title: true, shortDesc: true },
        }),
      [] as Array<{ slug: string; title: string; shortDesc: string }>,
    ),
    getVenues(),
  ]);

  const lines: string[] = [
    '# Norvex Sports',
    '',
    `> ${c.aboutShort}`,
    '',
    c.projectStatement,
    '',
    '## Key facts',
    '',
    '- Type: Professional football (soccer) development academy / sports club',
    '- City: Hyderabad, Telangana, India',
    '- Founded: 2026',
    `- Website: ${base}`,
    `- Phone: ${c.contact.phone}`,
    `- Email: ${c.contact.email}`,
    `- Free trial: yes — book at ${base}/contact#trial`,
    '- Age groups: grassroots kids through youth development to adult training',
    '',
    '## Training venues',
    '',
    ...venues.map(
      (v) =>
        `- ${v.name}${v.isPrimary ? ' (main academy)' : ''}: ${v.address ?? 'Hyderabad'} — map: ${v.mapUrl}`,
    ),
    '',
    '## Programs & services',
    '',
    ...(services.length
      ? services.map((s) => `- [${s.title}](${base}/services/${s.slug}): ${s.shortDesc}`)
      : ['- Football development programs, coaching, trials, tournaments and events.']),
    '',
    '## Frequently asked questions',
    '',
    ...SITE_FAQ.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Pages',
    '',
    `- [Home](${base}/)`,
    `- [About](${base}/about)`,
    `- [Services](${base}/services)`,
    `- [Events](${base}/events)`,
    `- [Team](${base}/team)`,
    `- [Location](${base}/location)`,
    `- [News](${base}/news)`,
    `- [Contact / Book a free trial](${base}/contact)`,
    `- [Sitemap](${base}/sitemap.xml)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
