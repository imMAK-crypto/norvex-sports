'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';

type ActionResult = { ok: boolean; message?: string } | void;

export function CmsForm({
  action,
  children,
  className = '',
  gap = 18,
}: {
  action: (fd: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  async function handle(fd: FormData) {
    try {
      const res = await action(fd);
      if (res && res.ok === false) toast.error(res.message ?? 'Something went wrong');
      else toast.success((res && res.message) || 'Saved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('NEXT_REDIRECT')) toast.error('Could not save. Try again.');
      throw err;
    }
  }
  return (
    <form action={handle} className={className} style={{ display: 'flex', flexDirection: 'column', gap }}>
      {children}
    </form>
  );
}

export function DeleteSubmit({ singular = 'item' }: { singular?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cms-btn cms-btn-danger"
      style={{ width: '100%' }}
      onClick={(e) => {
        if (!confirm(`Delete this ${singular}? This cannot be undone.`)) e.preventDefault();
      }}
    >
      {pending ? 'Deleting…' : `Delete this ${singular}`}
    </button>
  );
}

export function SubmitButton({
  children = 'Save changes',
  variant = 'primary',
  pendingLabel = 'Saving…',
}: {
  children?: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`cms-btn cms-btn-${variant}`} style={{ opacity: pending ? 0.6 : 1 }}>
      {pending ? pendingLabel : children}
    </button>
  );
}
