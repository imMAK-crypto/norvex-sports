'use client';

import { useState } from 'react';
import { loginAction } from './actions';

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await loginAction(formData);
    setPending(false);
    if (!res.ok) setError(res.message);
  }

  return (
    <form action={action} className="card space-y-4">
      <input type="hidden" name="next" value={next ?? '/admin'} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
