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
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const ok = await isValid(req.cookies.get(COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
