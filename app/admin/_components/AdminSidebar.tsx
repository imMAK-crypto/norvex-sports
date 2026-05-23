'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/content', label: 'Site Content' },
  { href: '/admin/contacts', label: 'Enquiries' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminSidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/10 bg-ink-900/60 p-4">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-brand-400 to-brand-700 text-black font-display">N</span>
        <span className="font-display tracking-wide">Norvex</span>
      </Link>
      <nav className="flex flex-col gap-1 text-sm">
        {LINKS.map((l) => {
          const active = l.href === '/admin' ? path === '/admin' : path?.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 transition ${
                active ? 'bg-brand-500/15 text-brand-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="mt-auto pt-6 text-xs text-white/40 hover:text-brand-400">
        View live site →
      </Link>
    </aside>
  );
}
