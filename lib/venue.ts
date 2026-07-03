import { prisma } from './prisma';

export type Venue = {
  id: string;
  name: string;
  address: string | null;
  mapUrl: string;
  embedUrl: string | null;
  isPrimary: boolean;
  order: number;
  isActive: boolean;
};

/**
 * Turn a Google Maps share link (e.g. https://maps.app.goo.gl/xxxx) into an
 * embeddable iframe URL + a human-readable address, without needing an API key.
 *
 * Short links can't be embedded directly, so we follow the redirect to the full
 * `/maps/place/<NAME>/…` URL, pull out the place segment, and feed it to the
 * key-free `?q=<place>&output=embed` endpoint which Google geocodes for us.
 *
 * Best-effort: if resolution fails, we fall back to whatever we can build from
 * the address the admin typed, or return null so the UI shows just a directions
 * button.
 */
export async function resolveMapLink(
  rawUrl: string,
  addressOverride?: string,
): Promise<{ embedUrl: string | null; address: string | null }> {
  const url = rawUrl.trim();
  if (!url) return { embedUrl: null, address: addressOverride?.trim() || null };

  const buildEmbed = (query: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=16`;

  // If the admin gave us an address, that alone is enough to build a map.
  const typedAddress = addressOverride?.trim() || '';

  let resolvedPlace = '';
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NorvexBot/1.0)' },
    });
    const finalUrl = res.url || url;
    const m = finalUrl.match(/\/maps\/place\/([^/@]+)/);
    if (m) {
      resolvedPlace = decodeURIComponent(m[1].replace(/\+/g, ' ')).trim();
    }
  } catch {
    // Network/blocked — fall through to address-based embed below.
  }

  const address = typedAddress || resolvedPlace || null;
  const query = typedAddress || resolvedPlace;
  const embedUrl = query ? buildEmbed(query) : null;
  return { embedUrl, address };
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
