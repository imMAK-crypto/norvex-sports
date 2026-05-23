import Link from 'next/link';
import { getSiteContent } from '@/lib/settings';
import { Logo } from './Logo';

export async function SiteFooter() {
  const c = await getSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {c.aboutShort}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={c.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-brand-400 hover:text-brand-400"
              >
                <SocialIcon name="instagram" />
              </a>
              <a
                href={c.social.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-brand-400 hover:text-brand-400"
              >
                <SocialIcon name="facebook" />
              </a>
              <a
                href={c.social.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-brand-400 hover:text-brand-400"
              >
                <SocialIcon name="youtube" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Programs</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href="/services" className="hover:text-brand-400">All Services</Link></li>
              <li><Link href="/events" className="hover:text-brand-400">Events</Link></li>
              <li><Link href="/contact#trial" className="hover:text-brand-400">Book a Trial</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400">Birthday Parties</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-brand-400">About</Link></li>
              <li><Link href="/team" className="hover:text-brand-400">Team</Link></li>
              <li><Link href="/news" className="hover:text-brand-400">News</Link></li>
              <li><Link href="/careers" className="hover:text-brand-400">Careers</Link></li>
              <li><Link href="/location" className="hover:text-brand-400">Location</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="hover:text-brand-400">{c.contact.phone}</a></li>
              <li><a href={`mailto:${c.contact.email}`} className="hover:text-brand-400">{c.contact.email}</a></li>
              <li>{c.contact.location}</li>
              <li>
                <a
                  href={`https://wa.me/${c.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-brand-400"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center">
          <p>© {year} Norvex Sports. All rights reserved.</p>
          <p>Hyderabad, Telangana — and every pitch we play on.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: 'instagram' | 'facebook' | 'youtube' }) {
  if (name === 'instagram') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.4c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.6A3 3 0 0 0 1 7.3 31 31 0 0 0 .4 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1C5 19.4 12 19.4 12 19.4s7 0 8.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.6 12 31 31 0 0 0 23 7.3zM9.8 15.4V8.6L15.6 12l-5.8 3.4z" />
    </svg>
  );
}
