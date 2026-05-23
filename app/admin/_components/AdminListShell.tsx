import Link from 'next/link';
import { ReactNode } from 'react';

export function AdminListShell({
  title,
  newHref,
  newLabel = 'New',
  children,
}: {
  title: string;
  newHref: string;
  newLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl">{title}</h1>
        <Link href={newHref} className="btn-primary">+ {newLabel}</Link>
      </header>
      <div className="admin-card p-0 overflow-hidden">{children}</div>
    </div>
  );
}

export function AdminFormShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">{title}</h1>
      <div className="admin-card">{children}</div>
    </div>
  );
}
