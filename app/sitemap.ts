import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/settings';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/events',
    '/team',
    '/gallery',
    '/news',
    '/careers',
    '/contact',
    '/location',
  ].map((p) => ({
    url: `${url}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1.0 : 0.7,
  }));

  try {
    const [services, events, news] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.event.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.newsPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticPages,
      ...services.map((s) => ({
        url: `${url}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...events.map((e) => ({
        url: `${url}/events/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...news.map((n) => ({
        url: `${url}/news/${n.slug}`,
        lastModified: n.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticPages;
  }
}
