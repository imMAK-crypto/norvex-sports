import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/settings';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = siteUrl();
  const now = new Date();

  // Higher-priority "money" pages get weekly crawl + stronger priority.
  const PRIORITY: Record<string, { priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = {
    '': { priority: 1.0, freq: 'weekly' },
    '/services': { priority: 0.9, freq: 'weekly' },
    '/contact': { priority: 0.9, freq: 'monthly' },
    '/events': { priority: 0.8, freq: 'weekly' },
    '/about': { priority: 0.8, freq: 'monthly' },
    '/location': { priority: 0.8, freq: 'monthly' },
  };

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/events',
    '/the-norvex-project',
    '/team',
    '/gallery',
    '/news',
    '/careers',
    '/contact',
    '/location',
  ].map((p) => ({
    url: `${url}${p}`,
    lastModified: now,
    changeFrequency: PRIORITY[p]?.freq ?? 'monthly',
    priority: PRIORITY[p]?.priority ?? 0.7,
  }));

  try {
    const [services, events, news] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true, imageUrl: true } }),
      prisma.event.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true, imageUrl: true } }),
      prisma.newsPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true, imageUrl: true } }),
    ]);

    // Sitemap spec requires absolute image URLs, and Next's serializer does not
    // XML-escape them — a raw "&" in a query string makes the whole sitemap
    // invalid XML, which Google's parser rejects.
    const withImages = (img: string | null | undefined) => {
      if (!img) return {};
      const abs = img.startsWith('http') ? img : `${url}${img}`;
      return { images: [abs.replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;')] };
    };

    return [
      ...staticPages,
      ...services.map((s) => ({
        url: `${url}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        ...withImages(s.imageUrl),
      })),
      ...events.map((e) => ({
        url: `${url}/events/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        ...withImages(e.imageUrl),
      })),
      ...news.map((n) => ({
        url: `${url}/news/${n.slug}`,
        lastModified: n.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        ...withImages(n.imageUrl),
      })),
    ];
  } catch {
    return staticPages;
  }
}
