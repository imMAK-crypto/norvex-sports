import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/settings';

export const revalidate = 600;

/** Escape the five XML predefined entities for safe element/attribute text. */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const base = siteUrl();
  const self = `${base}/feed.xml`;

  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date | null;
    updatedAt: Date;
  }> = [];
  try {
    posts = await prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50,
      select: { slug: true, title: true, excerpt: true, publishedAt: true, updatedAt: true },
    });
  } catch {
    posts = [];
  }

  const lastBuild = (posts[0]?.publishedAt ?? posts[0]?.updatedAt ?? new Date()).toUTCString();

  const items = posts
    .map((p) => {
      const link = `${base}/news/${p.slug}`;
      const date = (p.publishedAt ?? p.updatedAt).toUTCString();
      return [
        '    <item>',
        `      <title>${xml(p.title)}</title>`,
        `      <link>${xml(link)}</link>`,
        `      <guid isPermaLink="true">${xml(link)}</guid>`,
        `      <description>${xml(p.excerpt)}</description>`,
        `      <pubDate>${date}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Norvex Sports — News &amp; Updates</title>
    <link>${xml(`${base}/news`)}</link>
    <description>Latest match results, player achievements, event announcements and academy updates from Norvex Sports, Hyderabad.</description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}
