import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

/**
 * Resolve the session signing secret. Fail-closed: in production we refuse to
 * fall back to a known string, otherwise anyone could forge an admin JWT. A
 * dev-only fallback keeps local setup friction-free.
 */
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

const COOKIE_NAME = 'norvex_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; email: string };

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.sub === 'string' && typeof payload.email === 'string') {
      return { sub: payload.sub, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHORIZED');
  return s;
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function validateLogin(identifier: string, password: string) {
  const id = identifier.toLowerCase().trim();
  // Accept either the username (e.g. "norvex") or the email address.
  const user = await prisma.adminUser.findFirst({
    where: { OR: [{ email: id }, { username: id }] },
  });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
