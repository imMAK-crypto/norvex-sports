'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  Users,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const LINKS: Array<{ href: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { href: '/nvx-panel-7q2', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/nvx-panel-7q2/services', label: 'Services', Icon: Trophy },
  { href: '/nvx-panel-7q2/events', label: 'Events', Icon: Calendar },
  { href: '/nvx-panel-7q2/news', label: 'News', Icon: Newspaper },
  { href: '/nvx-panel-7q2/gallery', label: 'Gallery', Icon: ImageIcon },
  { href: '/nvx-panel-7q2/team', label: 'Team', Icon: Users },
  { href: '/nvx-panel-7q2/content', label: 'Site Content', Icon: FileText },
  { href: '/nvx-panel-7q2/contacts', label: 'Enquiries', Icon: Inbox },
  { href: '/nvx-panel-7q2/settings', label: 'Settings', Icon: SettingsIcon },
];

export function AdminSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 font-sans text-sm">
      {LINKS.map((l) => {
        const active = l.href === '/nvx-panel-7q2' ? path === '/nvx-panel-7q2' : path?.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 transition border-l-[3px] ${
              active
                ? 'border-brand-600 bg-brand-600/10 text-silver-100'
                : 'border-transparent text-silver-300 hover:bg-ink-800 hover:text-silver-100'
            }`}
          >
            <l.Icon className="h-4 w-4 flex-shrink-0" />
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-ink-500 bg-ink-900 p-4">
        <Link href="/nvx-panel-7q2" className="mb-6 inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center bg-brand-600 text-white font-display text-xl">N</span>
          <span className="font-display text-xl uppercase tracking-[0.15em] text-silver-100">Norvex</span>
        </Link>
        {nav}
        <Link href="/" target="_blank" className="mt-auto pt-6 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-silver-500 hover:text-brand-500">
          View live site <ExternalLink className="h-3 w-3" />
        </Link>
      </aside>

      {/* Mobile drawer trigger (rendered in flow; layout header has its own nav) */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open admin menu'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-40 md:hidden grid h-12 w-12 place-items-center bg-brand-600 text-white shadow-red-lg"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden bg-ink-950/95 backdrop-blur-sm pt-16 px-4 overflow-y-auto">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center bg-brand-600 text-white font-display text-xl">N</span>
            <span className="font-display text-xl uppercase tracking-[0.15em] text-silver-100">Norvex Admin</span>
          </div>
          {nav}
        </div>
      )}
    </>
  );
}
