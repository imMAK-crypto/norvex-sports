'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loginAction } from './actions';

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialError) toast.error(initialError);
  }, [initialError]);

  async function action(formData: FormData) {
    setPending(true);
    try {
      const res = await loginAction(formData);
      if (res && !res.ok) toast.error(res.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('NEXT_REDIRECT')) toast.error('Something went wrong. Try again.');
      throw err;
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input type="hidden" name="next" value={next ?? '/admin'} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="cms-label">Username or Email</span>
        <input
          name="email"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className="cms-field"
          style={{ height: 42 }}
          placeholder="norvex"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="cms-label">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="cms-field" style={{ height: 42 }} placeholder="••••••••" />
      </div>
      <button type="submit" disabled={pending} className="cms-btn cms-btn-primary" style={{ height: 42, opacity: pending ? 0.6 : 1 }}>
        {pending ? 'Signing in…' : 'Sign in →'}
      </button>
    </form>
  );
}
