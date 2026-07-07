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

  // Host/protocol canonicalization (root → www, http → https) is handled
  // entirely by Vercel at the platform level. The app must never redirect
  // based on hostname — doing so here previously fought Vercel's own
  // root→www redirect and caused an infinite redirect loop.

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

  // Forward the real pathname so the admin layout can enforce a second,
  // independent auth check (defense-in-depth: if this middleware is ever
  // bypassed, the layout still refuses to render admin pages without a session).
  if (pathname.startsWith('/nvx-panel-7q2')) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-nvx-pathname', pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals — the preview noindex header must cover
  // all public paths (including robots.txt / sitemap.xml); the admin guard
  // filters by pathname inside the handler.
  matcher: ['/((?!_next/).*)'],
};
