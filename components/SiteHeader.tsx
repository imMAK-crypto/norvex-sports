'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/events', label: 'Events' },
  { href: '/the-norvex-project', label: 'The Norvex Project' },
  { href: '/team', label: 'Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/location', label: 'Our Location' },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Mobile drawer rendered via Portal so it escapes the sticky header's stacking context
  const drawer =
    mounted &&
    createPortal(
      <>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className="xl:hidden fixed inset-0 transition-opacity duration-300"
          style={{
            zIndex: 9998,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
          aria-hidden={!open}
        />
        {/* Drawer panel */}
        <aside
          className="xl:hidden fixed top-0 right-0 bottom-0 w-[88%] max-w-sm"
          style={{
            zIndex: 9999,
            background: '#080808',
            borderLeft: '1px solid #2e2e2e',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: open ? '-10px 0 40px rgba(0,0,0,0.7)' : 'none',
          }}
          aria-hidden={!open}
        >
          <div
            className="flex items-center justify-between px-5"
            style={{ height: 64, borderBottom: '1px solid #2e2e2e', background: '#0d0d0d' }}
          >
            <span className="font-display text-xl uppercase tracking-[0.18em] text-brand-500">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center text-silver-100 hover:text-brand-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav
            className="flex flex-col overflow-y-auto"
            style={{ height: 'calc(100% - 64px)' }}
          >
            {NAV.map((item) => {
              const active = item.href === '/' ? path === '/' : path?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-5 py-4 font-sans text-base font-semibold uppercase tracking-[0.12em] transition"
                  style={{
                    borderLeft: active ? '3px solid #7c0000' : '3px solid transparent',
                    background: active ? '#141414' : 'transparent',
                    color: active ? '#cccccc' : '#a8a8a8',
                  }}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Link>
              );
            })}
            <div className="px-5 py-6 mt-auto" style={{ borderTop: '1px solid #2e2e2e' }}>
              <Link
                href="/contact#trial"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Book a Free Trial
              </Link>
            </div>
          </nav>
        </aside>
      </>,
      document.body,
    );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink-500 bg-ink-900/95 backdrop-blur-md'
          : 'border-b border-transparent bg-ink-900/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between md:h-24">
        <Logo />

        <nav className="hidden xl:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap px-3 py-2 font-sans text-[13px] font-medium uppercase tracking-[0.15em] transition ${
                  active ? 'text-silver-100' : 'text-silver-300 hover:text-silver-100'
                }`}
              >
                {item.label}
                {active && <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-brand-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Right-side controls — Book Trial (desktop+mobile) sits beside hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/contact#trial"
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-brand-600 px-3 sm:px-4 h-11 font-sans text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-500 active:scale-[0.98]"
          >
            Book Trial
          </Link>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink-500 bg-ink-800 text-silver-100 transition hover:border-brand-600 hover:text-brand-500"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {drawer}
    </header>
  );
}
