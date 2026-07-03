import { prisma } from './prisma';

export type Venue = {
  id: string;
  name: string;
  address: string | null;
  mapUrl: string;
  embedUrl: string | null;
  lat: number | null;
  lng: number | null;
  isPrimary: boolean;
  order: number;
  isActive: boolean;
};

/**
 * Turn a Google Maps share link (e.g. https://maps.app.goo.gl/xxxx) into an
 * embeddable iframe URL, a human-readable address, and — when the resolved
 * URL exposes them — latitude/longitude. No API key required.
 *
 * Short links can't be embedded directly, so we follow the redirect to the full
 * `/maps/place/<NAME>/…` URL, pull out the place segment, and feed it to the
 * key-free `?q=<place>&output=embed` endpoint which Google geocodes for us.
 * Full desktop links usually carry `@lat,lng` or `!3d<lat>!4d<lng>` which we
 * harvest for precise structured-data geo.
 *
 * Best-effort: if resolution fails we fall back to the admin-typed address, or
 * return nulls so the UI shows just a directions button.
 */
export async function resolveMapLink(
  rawUrl: string,
  addressOverride?: string,
): Promise<{ embedUrl: string | null; address: string | null; lat: number | null; lng: number | null }> {
  const url = rawUrl.trim();
  const typedAddress = addressOverride?.trim() || '';
  if (!url) return { embedUrl: null, address: typedAddress || null, lat: null, lng: null };

  const buildEmbed = (query: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=16`;

  let resolvedPlace = '';
  let lat: number | null = null;
  let lng: number | null = null;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NorvexBot/1.0)' },
    });
    const finalUrl = res.url || url;
    const place = finalUrl.match(/\/maps\/place\/([^/@]+)/);
    if (place) resolvedPlace = decodeURIComponent(place[1].replace(/\+/g, ' ')).trim();

    // Prefer the exact !3d<lat>!4d<lng> pin, else the @lat,lng viewport centre.
    const pin = finalUrl.match(/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/);
    const at = finalUrl.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    const src = pin ?? at;
    if (src) {
      lat = Number(src[1]);
      lng = Number(src[2]);
    }
  } catch {
    // Network/blocked — fall through to address-based embed below.
  }

  const address = typedAddress || resolvedPlace || null;
  const query = typedAddress || resolvedPlace;
  const embedUrl = query ? buildEmbed(query) : null;
  return { embedUrl, address, lat, lng };
}

export async function getVenues(activeOnly = true): Promise<Venue[]> {
  try {
    return await prisma.venue.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });
  } catch {
    return [];
  }
}
