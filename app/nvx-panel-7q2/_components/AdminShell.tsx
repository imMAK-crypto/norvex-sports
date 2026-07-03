'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = { href: string; letter: string; label: string };

type TipFns = { onShow?: (label: string, y: number) => void; onHide?: () => void };

const GROUPS: NavItem[][] = [
  [
    { href: '/nvx-panel-7q2', letter: '▦', label: 'Dashboard' },
    { href: '/nvx-panel-7q2/contacts', letter: '✉', label: 'Enquiries' },
  ],
  [
    { href: '/nvx-panel-7q2/pages/home', letter: 'H', label: 'Home Page' },
    { href: '/nvx-panel-7q2/pages/about', letter: 'A', label: 'About' },
    { href: '/nvx-panel-7q2/pages/norvex', letter: 'P', label: 'Norvex Project' },
    { href: '/nvx-panel-7q2/pages/careers', letter: 'C', label: 'Careers' },
    { href: '/nvx-panel-7q2/pages/contact', letter: 'O', label: 'Contact' },
    { href: '/nvx-panel-7q2/pages/location', letter: 'L', label: 'Location' },
  ],
  [
    { href: '/nvx-panel-7q2/services', letter: 'S', label: 'Services' },
    { href: '/nvx-panel-7q2/events', letter: 'E', label: 'Events' },
    { href: '/nvx-panel-7q2/news', letter: 'N', label: 'News' },
    { href: '/nvx-panel-7q2/team', letter: 'T', label: 'Team' },
    { href: '/nvx-panel-7q2/gallery', letter: '▤', label: 'Gallery' },
  ],
  [{ href: '/nvx-panel-7q2/media', letter: '◫', label: 'Media Library' }],
];

const BOTTOM: NavItem[] = [
  { href: '/nvx-panel-7q2/content', letter: '{}', label: 'Site Content' },
  { href: '/nvx-panel-7q2/settings', letter: '⚙', label: 'Settings' },
];

const TITLES: Array<[string, string]> = [
  ['/nvx-panel-7q2/pages/home', 'Home Page'],
  ['/nvx-panel-7q2/pages/about', 'About Page'],
  ['/nvx-panel-7q2/pages/norvex', 'The Norvex Project'],
  ['/nvx-panel-7q2/pages/careers', 'Careers Page'],
  ['/nvx-panel-7q2/pages/contact', 'Contact Page'],
  ['/nvx-panel-7q2/pages/location', 'Location Page'],
  ['/nvx-panel-7q2/services', 'Services'],
  ['/nvx-panel-7q2/events', 'Events'],
  ['/nvx-panel-7q2/news', 'News'],
  ['/nvx-panel-7q2/team', 'Team'],
  ['/nvx-panel-7q2/gallery', 'Gallery Manager'],
  ['/nvx-panel-7q2/media', 'Media Library'],
  ['/nvx-panel-7q2/content', 'Site Content'],
  ['/nvx-panel-7q2/settings', 'Settings'],
  ['/nvx-panel-7q2/contacts', 'Enquiries'],
  ['/nvx-panel-7q2', 'Dashboard'],
];

function isActive(href: string, path: string): boolean {
  return href === '/nvx-panel-7q2' ? path === '/nvx-panel-7q2' : path.startsWith(href);
}

function RailIcon({ item, path, onShow, onHide }: { item: NavItem; path: string } & TipFns) {
  const on = isActive(item.href, path);
  const show = (e: React.SyntheticEvent<HTMLElement>) => {
    if (!item.label) return;
    const r = e.currentTarget.getBoundingClientRect();
    onShow?.(item.label, r.top + r.height / 2);
  };
  return (
    <Link
      href={item.href}
      aria-label={item.label || undefined}
      onMouseEnter={show}
      onMouseLeave={() => onHide?.()}
      onFocus={show}
      onBlur={() => onHide?.()}
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
  user: { email: string; name: string; role: string; username?: string | null; avatarUrl?: string | null };
  unread: number;
}) {
  const path = usePathname() || '/nvx-panel-7q2';
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tip, setTip] = useState<{ label: string; y: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const title = TITLES.find(([h]) => isActive(h, path))?.[1] ?? 'CMS';
  const initial = (user.name || user.email).charAt(0).toUpperCase();
  const tipFns: TipFns = { onShow: (label, y) => setTip({ label, y }), onHide: () => setTip(null) };

  // Full nav list for the mobile sheet — quick add, every section, through Settings.
  const SHEET_NAV: NavItem[] = [{ href: '/nvx-panel-7q2/events/new', letter: '+', label: 'New event' }, ...GROUPS.flat(), ...BOTTOM];

  // Close menus/sheets on route change or Escape.
  useEffect(() => { setMenuOpen(false); setSheetOpen(false); }, [path]);
  useEffect(() => {
    if (!menuOpen && !sheetOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); setSheetOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, sheetOpen]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'clip' }}>
      {/* ---------- ICON RAIL ---------- */}
      <aside
        className="hidden md:flex"
        style={{
          width: 96,
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
          href="/nvx-panel-7q2"
          aria-label="Norvex Admin — dashboard"
          className="cms-pop cms-lift"
          style={{
            width: 88, height: 64, borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flex: 'none', textDecoration: 'none', padding: 2,
          }}
        >
          <Image src="/norvex_sports_logo.png" alt="Norvex Sports" width={755} height={364} priority style={{ width: 84, height: 'auto' }} />
        </Link>
        <Link
          href="/nvx-panel-7q2/events/new"
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
                  <RailIcon key={item.href} item={item} path={path} {...tipFns} />
                ))}
                {gi < GROUPS.length - 1 && (
                  <div style={{ width: 20, height: 1, background: '#26292e', flex: 'none' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, flex: 'none', paddingTop: 8 }}>
            {BOTTOM.map((item) => (
              <RailIcon key={item.href} item={item} path={path} {...tipFns} />
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
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflowX: 'clip', display: 'flex', flexDirection: 'column' }}>
        {/* topbar */}
        <header
          className="cms-topbar"
          style={{
            height: 62, flex: 'none', borderBottom: '1px solid var(--line)', display: 'flex',
            alignItems: 'center', background: 'var(--canvas)', minWidth: 0,
            position: 'sticky', top: 0, zIndex: 20,
          }}
        >
          <Link href="/nvx-panel-7q2" aria-label="Norvex Admin" style={{ display: 'flex', alignItems: 'center', flex: 'none' }} className="cms-lift">
            <Image src="/norvex_sports_logo.png" alt="Norvex Sports" width={755} height={364} priority style={{ height: 28, width: 'auto' }} />
          </Link>
          <span className="mono hidden sm:inline" style={{ fontSize: 11, color: 'var(--t5)', flex: 'none' }}>CMS /</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          <div style={{ flex: 1, minWidth: 8 }} />
          <div
            className="hidden lg:flex"
            style={{
              width: 220, height: 36, border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--panel-2)',
              alignItems: 'center', gap: 9, padding: '0 12px', color: 'var(--t5)', fontSize: 13,
            }}
          >
            <span className="mono">⌕</span> Search content…
          </div>
          <Link href="/" target="_blank" className="cms-btn cms-btn-ghost hidden sm:inline-flex" style={{ height: 36 }}>
            View site <span style={{ color: 'var(--t4)' }}>↗</span>
          </Link>
          <Link
            href="/nvx-panel-7q2/contacts"
            aria-label={`${unread} unread enquiries`}
            className="cms-lift"
            style={{
              width: 36, height: 36, border: '1px solid var(--line-2)', borderRadius: 9, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--t3)', position: 'relative',
              flex: 'none', textDecoration: 'none',
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
          </Link>
          <div style={{ position: 'relative', paddingLeft: 8, borderLeft: '1px solid var(--line)', flex: 'none' }}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Account & settings"
              className="cms-lift"
              style={{
                display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: '1px solid transparent',
                borderRadius: 10, padding: '3px 5px', cursor: 'pointer',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #3a3f45', background: '#1f2226', display: 'grid', placeItems: 'center', color: 'var(--accent)', fontWeight: 700, overflow: 'hidden' }}>
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initial
                )}
              </div>
              <div className="hidden sm:flex" style={{ flexDirection: 'column', lineHeight: 1.25, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{user.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--t4)' }}>{user.role}</span>
              </div>
              <span className="hidden sm:inline" style={{ color: 'var(--t4)', fontSize: 10, transition: 'transform .2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>

            {menuOpen && (
              <>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'transparent', border: 'none', cursor: 'default' }}
                />
                <div
                  role="menu"
                  className="cms-glass cms-pop"
                  style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 256, borderRadius: 14, padding: 8, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px 12px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #3a3f45', background: '#1f2226', display: 'grid', placeItems: 'center', color: 'var(--accent)', fontWeight: 700, flex: 'none', overflow: 'hidden' }}>
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        initial
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600 }}>{user.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--t4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                      <span style={{ display: 'inline-block', marginTop: 4, fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: 20, padding: '2px 8px' }}>{user.role}</span>
                    </div>
                  </div>
                  <Link role="menuitem" href="/nvx-panel-7q2/settings" onClick={() => setMenuOpen(false)} className="cms-menu-item"><span className="ico">⚙</span> Settings</Link>
                  <Link role="menuitem" href="/nvx-panel-7q2/settings#password" onClick={() => setMenuOpen(false)} className="cms-menu-item"><span className="ico mono">⚿</span> Change password</Link>
                  <Link role="menuitem" href="/nvx-panel-7q2/content" onClick={() => setMenuOpen(false)} className="cms-menu-item"><span className="ico mono">{'{}'}</span> Site content</Link>
                  <Link role="menuitem" href="/nvx-panel-7q2/media" onClick={() => setMenuOpen(false)} className="cms-menu-item"><span className="ico mono">◫</span> Media library</Link>
                  <Link role="menuitem" href="/" target="_blank" onClick={() => setMenuOpen(false)} className="cms-menu-item"><span className="ico">↗</span> View site</Link>
                  <div style={{ height: 1, background: 'var(--line)', margin: '5px 6px' }} />
                  <form action="/api/admin/logout" method="POST">
                    <button type="submit" role="menuitem" className="cms-menu-item" style={{ color: 'var(--accent)' }}><span className="ico" style={{ color: 'var(--accent)' }}>⏻</span> Log out</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>

        {/* scroll area */}
        <main key={path} className="cms-fade" style={{ flex: 1, overflowY: 'auto', overflowX: 'clip', minWidth: 0, padding: '22px 18px 96px' }}>
          {children}
        </main>
      </div>

      {/* glass flyout label for the icon rail (desktop hover/focus) */}
      {tip && (
        <div className="cms-railtip" style={{ left: 102, top: tip.y }}>
          {tip.label}
        </div>
      )}

      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <nav
        className="flex md:hidden cms-glass"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          alignItems: 'center', justifyContent: 'space-around', padding: '10px 18px 22px',
          borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 0 0',
        }}
      >
        {[
          { href: '/nvx-panel-7q2', letter: '▦' },
          { href: '/nvx-panel-7q2/pages/home', letter: 'H' },
        ].map((i) => (
          <RailIcon key={i.href} item={{ ...i, label: '' }} path={path} />
        ))}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Open menu"
          style={{
            width: 50, height: 50, borderRadius: 16, background: 'var(--lime)', color: '#1a1c10',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700,
            boxShadow: '0 6px 16px rgba(200,232,90,.22)', border: 'none', cursor: 'pointer',
          }}
        >
          ☰
        </button>
        {[
          { href: '/nvx-panel-7q2/media', letter: '◫' },
          { href: '/nvx-panel-7q2/settings', letter: '⚙' },
        ].map((i) => (
          <RailIcon key={i.href} item={{ ...i, label: '' }} path={path} />
        ))}
      </nav>

      {/* ---------- MOBILE GLASS MENU SHEET ---------- */}
      {sheetOpen && (
        <div className="md:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setSheetOpen(false)}
            className="cms-sheet-backdrop"
            style={{ position: 'fixed', inset: 0, zIndex: 47, background: 'rgba(8,9,10,.55)', border: 'none', cursor: 'default' }}
          />
          <div
            role="menu"
            className="cms-sheet cms-glass"
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 48, maxHeight: '58vh',
              borderRadius: '22px 22px 0 0', padding: '10px 16px calc(20px + env(safe-area-inset-bottom))',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,.18)', margin: '2px auto 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>Menu</span>
              <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line-2)', background: 'none', color: 'var(--t3)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, overflowY: 'auto', paddingBottom: 4 }}>
              {SHEET_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSheetOpen(false)}
                  className="cms-sheet-item mono"
                  data-on={isActive(item.href, path)}
                >
                  <span className="glyph">{item.letter}</span>
                  <span style={{ fontFamily: 'var(--font-grotesk), sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
