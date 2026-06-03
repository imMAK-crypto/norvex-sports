'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
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
      // loginAction redirects on success — only returns on failure
      if (res && !res.ok) toast.error(res.message);
    } catch (err: unknown) {
      // Next redirects throw an internal NEXT_REDIRECT — ignore those, surface others
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('NEXT_REDIRECT')) toast.error('Something went wrong. Try again.');
      throw err;
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={action} className="card space-y-4">
      <input type="hidden" name="next" value={next ?? '/admin'} />
      <div>
        <label className="label" htmlFor="email">Username or Email</label>
        <input
          id="email"
          name="email"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className="input"
          placeholder="norvex@9191"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
        {pending ? 'Signing in…' : (<>Sign in <LogIn className="ml-2 h-4 w-4" /></>)}
      </button>
    </form>
  );
}
