'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { changePassword } from './actions';

export function PasswordForm() {
  const [pending, setPending] = useState(false);

  async function action(fd: FormData) {
    setPending(true);
    const res = await changePassword(fd);
    setPending(false);
    if (res.ok) {
      toast.success(res.message ?? 'Password updated.');
      (document.getElementById('password-form') as HTMLFormElement | null)?.reset();
    } else {
      toast.error(res.message ?? 'Could not update password.');
    }
  }

  return (
    <form id="password-form" action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="cms-label">Current password</span>
        <input type="password" name="current" className="cms-field" autoComplete="current-password" required />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="cms-label">New password · min 8 chars</span>
        <input type="password" name="next" className="cms-field" autoComplete="new-password" required minLength={8} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="cms-label">Confirm new password</span>
        <input type="password" name="confirm" className="cms-field" autoComplete="new-password" required minLength={8} />
      </label>
      <button type="submit" disabled={pending} className="cms-btn cms-btn-primary" style={{ alignSelf: 'flex-start', opacity: pending ? 0.6 : 1 }}>
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
