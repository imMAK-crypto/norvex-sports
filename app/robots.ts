import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/settings';

export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Admin panel path is intentionally omitted here — robots.txt is public,
        // so listing it would advertise the URL. It's simply not linked anywhere.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
