'use client';

import { useState } from 'react';
import { changePassword } from './actions';

export function PasswordForm() {
  const [state, setState] = useState<{ ok?: boolean; msg?: string; pending?: boolean }>({});
  async function action(fd: FormData) {
    setState({ pending: true });
    const res = await changePassword(fd);
    setState({ ok: res.ok, msg: res.message });
  }
  return (
    <form action={action} className="space-y-4 max-w-md">
      <div>
        <label className="label">Current password</label>
        <input type="password" name="current" className="input" autoComplete="current-password" required />
      </div>
      <div>
        <label className="label">New password (min 8 chars)</label>
        <input type="password" name="next" className="input" autoComplete="new-password" required minLength={8} />
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <input type="password" name="confirm" className="input" autoComplete="new-password" required minLength={8} />
      </div>
      <button type="submit" disabled={state.pending} className="btn-primary disabled:opacity-50">
        {state.pending ? 'Updating…' : 'Update password'}
      </button>
      {state.msg && <p className={`text-sm ${state.ok ? 'text-brand-400' : 'text-red-400'}`}>{state.msg}</p>}
    </form>
  );
}
