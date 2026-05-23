'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { setSessionCookie, signSession, validateLogin } from '@/lib/auth';
import { clientKey, rateLimit } from '@/lib/rate-limit';

export async function loginAction(formData: FormData) {
  const rl = rateLimit(clientKey({ headers: headers() }, 'login'), { max: 8, windowMs: 15 * 60 * 1000 });
  if (!rl.ok) {
    return { ok: false as const, message: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!email || !password) return { ok: false as const, message: 'Email and password are required.' };

  const user = await validateLogin(email, password);
  if (!user) return { ok: false as const, message: 'Invalid email or password.' };

  const token = await signSession({ sub: user.id, email: user.email });
  await setSessionCookie(token);

  redirect(next.startsWith('/admin') ? next : '/admin');
}
