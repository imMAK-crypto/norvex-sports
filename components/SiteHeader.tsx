'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition ${
                  active ? 'text-brand-400' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/contact#trial" className="btn-primary">
            Book a Free Trial
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative h-10 w-10 grid place-items-center rounded-lg border border-white/10 bg-white/5"
        >
          <span className={`block h-0.5 w-5 bg-white transition ${open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'}`} />
          <span className={`absolute block h-0.5 w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink-950/95 backdrop-blur-md">
          <nav className="container-x flex flex-col gap-1 py-6">
            {NAV.map((item) => {
              const active = item.href === '/' ? path === '/' : path?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-3 text-base font-semibold transition ${
                    active ? 'bg-brand-500/10 text-brand-400' : 'text-white/90 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact#trial" className="btn-primary mt-4">
              Book a Free Trial
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
