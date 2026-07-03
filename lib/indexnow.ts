import { siteUrl } from './settings';

/**
 * IndexNow key — intentionally public (the protocol verifies ownership by
 * fetching /<key>.txt from this host, which lives in /public).
 */
const INDEXNOW_KEY = 'ba40dc48bab0ba4810730ead3305a1c0';

/**
 * Ping IndexNow (Bing, Yandex, Seznam, Naver…) so fresh/changed pages are
 * crawled within minutes instead of days. Google ignores IndexNow but picks
 * changes up via the sitemap. Fire-and-forget: never throws, short timeout,
 * and skipped outside production so local/preview saves don't ping.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production') return;
  const base = siteUrl();
  const host = base.replace(/^https?:\/\//, '');
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((p) => `${base}${p.startsWith('/') ? p : `/${p}`}`),
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort — indexing pings must never break an admin save.
  }
}
