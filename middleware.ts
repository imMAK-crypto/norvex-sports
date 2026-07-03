import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Fail-closed secret resolution — must match lib/auth.ts. In production we never
// fall back to a known string (which would let anyone forge an admin session).
function resolveSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters in production.');
    }
    return new TextEncoder().encode('dev-secret-change-me-min-32-chars-long-please');
  }
  return new TextEncoder().encode(s);
}

const SECRET = resolveSecret();

const COOKIE = 'norvex_session';

/** Canonical production host — every other host consolidates onto this. */
const CANONICAL_HOST = 'norvexsports.in';

async function isValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = (req.headers.get('host') ?? '').toLowerCase().split(':')[0];

  // ── Host canonicalization (production only) ────────────────────────────
  // www → apex is always safe: a www request only reaches Vercel once DNS
  // points here. The *.vercel.app alias redirect is gated behind
  // CANONICAL_DNS_LIVE so we never bounce visitors to the apex before its
  // DNS cuts over to Vercel.
  if (process.env.VERCEL_ENV === 'production' && host && host !== CANONICAL_HOST) {
    const dnsLive = process.env.CANONICAL_DNS_LIVE === '1';
    if (host === `www.${CANONICAL_HOST}` || (dnsLive && host.endsWith('.vercel.app'))) {
      const url = req.nextUrl.clone();
      url.protocol = 'https:';
      url.host = CANONICAL_HOST;
      url.port = '';
      return NextResponse.redirect(url, 308);
    }
  }

  // Preview deployments must never be indexed.
  if (process.env.VERCEL_ENV === 'preview') {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  // ── Admin guard ────────────────────────────────────────────────────────
  if (pathname.startsWith('/nvx-panel-7q2') && pathname !== '/nvx-panel-7q2/login') {
    const ok = await isValid(req.cookies.get(COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/nvx-panel-7q2/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals — host canonicalization must cover all
  // public paths (including robots.txt / sitemap.xml); the admin guard
  // filters by pathname inside the handler.
  matcher: ['/((?!_next/).*)'],
};
