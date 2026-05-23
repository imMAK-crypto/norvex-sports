'use server';

import { redirect } from 'next/navigation';
import { setSessionCookie, signSession, validateLogin } from '@/lib/auth';

export async function loginAction(formData: FormData) {
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
