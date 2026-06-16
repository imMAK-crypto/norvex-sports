'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = { href: string; letter: string; label: string };

const GROUPS: NavItem[][] = [
  [
    { href: '/admin', letter: '▦', label: 'Dashboard' },
    { href: '/admin/contacts', letter: '✉', label: 'Enquiries' },
  ],
  [
    { href: '/admin/pages/home', letter: 'H', label: 'Home Page' },
    { href: '/admin/pages/about', letter: 'A', label: 'About' },
    { href: '/admin/pages/norvex', letter: 'P', label: 'Norvex Project' },
    { href: '/admin/pages/careers', letter: 'C', label: 'Careers' },
    { href: '/admin/pages/contact', letter: 'O', label: 'Contact' },
    { href: '/admin/pages/location', letter: 'L', label: 'Location' },
  ],
  [
    { href: '/admin/services', letter: 'S', label: 'Services' },
    { href: '/admin/events', letter: 'E', label: 'Events' },
    { href: '/admin/news', letter: 'N', label: 'News' },
    { href: '/admin/team', letter: 'T', label: 'Team' },
    { href: '/admin/gallery', letter: '▤', label: 'Gallery' },
  ],
  [{ href: '/admin/media', letter: '◫', label: 'Media Library' }],
];

const BOTTOM: NavItem[] = [
  { href: '/admin/content', letter: '{}', label: 'Site Content' },
  { href: '/admin/settings', letter: '⚙', label: 'Settings' },
];

const TITLES: Array<[string, string]> = [
  ['/admin/pages/home', 'Home Page'],
  ['/admin/pages/about', 'About Page'],
  ['/admin/pages/norvex', 'The Norvex Project'],
  ['/admin/pages/careers', 'Careers Page'],
  ['/admin/pages/contact', 'Contact Page'],
  ['/admin/pages/location', 'Location Page'],
  ['/admin/services', 'Services'],
  ['/admin/events', 'Events'],
  ['/admin/news', 'News'],
  ['/admin/team', 'Team'],
  ['/admin/gallery', 'Gallery Manager'],
  ['/admin/media', 'Media Library'],
  ['/admin/content', 'Site Content'],
  ['/admin/settings', 'Settings'],
  ['/admin/contacts', 'Enquiries'],
  ['/admin', 'Dashboard'],
];

function isActive(href: string, path: string): boolean {
  return href === '/admin' ? path === '/admin' : path.startsWith(href);
}

function RailIcon({ item, path }: { item: NavItem; path: string }) {
  const on = isActive(item.href, path);
  return (
    <Link
      href={item.href}
      title={item.label}
      className="cms-nav-item mono"
      style={{
        width: 38,
        height: 38,
        borderRadius: on ? '50%' : 12,
        background: on ? '#f2f3f5' : 'transparent',
        color: on ? '#16181b' : '#8a8f96',
        border: on ? '1px solid #f2f3f5' : '1px solid #2c2f34',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        flex: 'none',
        textDecoration: 'none',
      }}
    >
      {item.letter}
    </Link>
  );
}

export function AdminShell({
  children,
  user,
  unread,
}: {
  children: React.ReactNode;
  user: { email: string; name: string; role: string };
  unread: number;
}) {
  const path = usePathname() || '/admin';
  const [, setMobileOpen] = useState(false);
  const title = TITLES.find(([h]) => isActive(h, path))?.[1] ?? 'CMS';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ---------- ICON RAIL ---------- */}
      <aside
        className="hidden md:flex"
        style={{
          width: 78,
          flex: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 13,
          padding: '16px 0',
          background: 'var(--canvas)',
          borderRight: '1px solid #1f2226',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <Link
          href="/admin"
          className="cms-pop"
          style={{
            width: 40, height: 40, borderRadius: 12, border: '1px solid #2c2f34',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontWeight: 700, fontSize: 18, flex: 'none', textDecoration: 'none',
          }}
        >
          N
        </Link>
        <Link
          href="/admin/events/new"
          title="Quick add — new event"
          className="cms-nav-item"
          style={{
            width: 46, height: 46, borderRadius: 15, background: 'var(--lime)', color: '#1a1c10',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 500,
            boxShadow: '0 6px 16px rgba(200,232,90,.20)', flex: 'none', textDecoration: 'none',
          }}
        >
          +
        </Link>

        <div
          className="rail-scroll"
          style={{
            flex: 1, width: 58, background: 'var(--panel-2)', border: '1px solid #23262a',
            borderRadius: 29, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'space-between', padding: '14px 0', minHeight: 0,
          }}
        >
          <div
            className="rail-scroll"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, overflowY: 'auto', minHeight: 0, paddingBottom: 2 }}
          >
            {GROUPS.map((group, gi) => (
              <div key={gi} style={{ display: 'contents' }}>
                {group.map((item) => (
                  <RailIcon key={item.href} item={item} path={path} />
                ))}
                {gi < GROUPS.length - 1 && (
                  <div style={{ width: 20, height: 1, background: '#26292e', flex: 'none' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, flex: 'none', paddingTop: 8 }}>
            {BOTTOM.map((item) => (
              <RailIcon key={item.href} item={item} path={path} />
            ))}
          </div>
        </div>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            title="Log out"
            className="cms-nav-item"
            style={{
              width: 42, height: 42, borderRadius: 13, border: '1px solid #2c2f34', background: 'var(--panel-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8f96', fontSize: 14, cursor: 'pointer',
            }}
          >
            ⏻
          </button>
        </form>
      </aside>

      {/* ---------- MAIN ---------- */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* topbar */}
        <header
          style={{
            height: 62, flex: 'none', borderBottom: '1px solid var(--line)', display: 'flex',
            alignItems: 'center', gap: 16, padding: '0 18px', background: 'var(--canvas)',
            position: 'sticky', top: 0, zIndex: 20,
          }}
        >
          <span className="mono hidden sm:inline" style={{ fontSize: 11, color: 'var(--t5)' }}>CMS /</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>{title}</span>
          <div style={{ flex: 1 }} />
          <div
            className="hidden lg:flex"
            style={{
              width: 220, height: 36, border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--panel-2)',
              alignItems: 'center', gap: 9, padding: '0 12px', color: 'var(--t5)', fontSize: 13,
            }}
          >
            <span className="mono">⌕</span> Search content…
          </div>
          <Link href="/" target="_blank" className="cms-btn cms-btn-ghost" style={{ height: 36 }}>
            View site <span style={{ color: 'var(--t4)' }}>↗</span>
          </Link>
          <div
            style={{
              width: 36, height: 36, border: '1px solid var(--line-2)', borderRadius: 9, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--t3)', position: 'relative',
            }}
            title={`${unread} unread enquiries`}
          >
            ⌗
            {unread > 0 && (
              <span
                className="cms-pulse"
                style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 8, borderLeft: '1px solid var(--line)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #3a3f45', background: '#1f2226', display: 'grid', placeItems: 'center', color: 'var(--accent)', fontWeight: 700 }}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex" style={{ flexDirection: 'column', lineHeight: 1.25 }}>
              <span style={{ fontSize: 12, color: 'var(--t2)' }}>{user.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--t4)' }}>{user.role}</span>
            </div>
          </div>
        </header>

        {/* scroll area */}
        <main key={path} className="cms-fade" style={{ flex: 1, overflowY: 'auto', padding: '22px 18px 96px' }}>
          {children}
        </main>
      </div>

      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <nav
        className="flex md:hidden"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          alignItems: 'center', justifyContent: 'space-around', padding: '10px 18px 22px',
          borderTop: '1px solid #1f2226', background: 'var(--panel-2)',
        }}
        onClick={() => setMobileOpen(false)}
      >
        {[
          { href: '/admin', letter: '▦' },
          { href: '/admin/pages/home', letter: 'H' },
        ].map((i) => (
          <RailIcon key={i.href} item={{ ...i, label: '' }} path={path} />
        ))}
        <Link
          href="/admin/events/new"
          style={{
            width: 50, height: 50, borderRadius: 16, background: 'var(--lime)', color: '#1a1c10',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            boxShadow: '0 6px 16px rgba(200,232,90,.22)', textDecoration: 'none',
          }}
        >
          +
        </Link>
        {[
          { href: '/admin/media', letter: '◫' },
          { href: '/admin/settings', letter: '⚙' },
        ].map((i) => (
          <RailIcon key={i.href} item={{ ...i, label: '' }} path={path} />
        ))}
      </nav>
    </div>
  );
}
