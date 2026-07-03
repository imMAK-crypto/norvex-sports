import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/settings';

// AI/answer-engine crawlers we explicitly welcome (AEO): being cited by
// ChatGPT/Claude/Perplexity/Google AI Overviews is a discovery channel.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'meta-externalagent',
];

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
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/'],
      })),
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
