import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { getSiteContent } from '@/lib/settings';
import { LogoMark } from './Logo';
import { ThreadsIcon, XIcon } from './SocialIcons';
import { EmailLink } from './EmailLink';

export async function SiteFooter() {
  const c = await getSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-24 border-t border-ink-500 bg-ink-950">
      {/* SOCIAL STRIP */}
      <div className="border-b border-ink-500 bg-ink-900">
        <div className="container-x py-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-500">
                Follow us
              </div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl uppercase tracking-wide text-silver-100">
                Stay Connected with Norvex Sports
              </h3>
              <p className="mt-1 font-sans text-sm text-silver-200 max-w-xl">
                Latest updates, training highlights, match moments and upcoming events.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={c.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary"
              >
                <Instagram className="mr-2 h-4 w-4" /> Follow on Instagram
              </a>
              <a
                href={c.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-outline"
              >
                <Linkedin className="mr-2 h-4 w-4" /> Connect on LinkedIn
              </a>
              {c.social.threads && (
                <a
                  href={c.social.threads}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-outline"
                >
                  <ThreadsIcon className="mr-2 h-4 w-4" /> Threads
                </a>
              )}
              {c.social.x && (
                <a
                  href={c.social.x}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-outline"
                >
                  <XIcon className="mr-2 h-4 w-4" /> Follow on X
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-12 md:py-16">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-4">
          <div>
            <LogoMark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-200">
              {c.aboutShort}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href={c.social.instagram} label="Instagram (@norvexsports)" Icon={Instagram} />
              <SocialLink href={c.social.facebook} label="Facebook (Norvex Sports)" Icon={Facebook} />
              <SocialLink href={c.social.linkedin} label="LinkedIn (Norvex Sports)" Icon={Linkedin} />
              {c.social.threads && (
                <SocialLink href={c.social.threads} label="Threads (@norvexsports)" Icon={ThreadsIcon} />
              )}
              {c.social.x && (
                <SocialLink href={c.social.x} label="X (@NORVEXSPORTS)" Icon={XIcon} />
              )}
              {c.social.youtube && (
                <SocialLink href={c.social.youtube} label="YouTube (Norvex Sports)" Icon={Youtube} />
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base uppercase tracking-[0.2em] text-silver-100">Quick Links</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-silver-200">
              <li><Link href="/about" className="hover:text-brand-500">About</Link></li>
              <li><Link href="/services" className="hover:text-brand-500">Services</Link></li>
              <li><Link href="/events" className="hover:text-brand-500">Events</Link></li>
              <li><Link href="/the-norvex-project" className="hover:text-brand-500">The Norvex Project</Link></li>
              <li><Link href="/team" className="hover:text-brand-500">Team</Link></li>
              <li><Link href="/gallery" className="hover:text-brand-500">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base uppercase tracking-[0.2em] text-silver-100">Company</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-silver-200">
              <li><Link href="/news" className="hover:text-brand-500">News</Link></li>
              <li><Link href="/careers" className="hover:text-brand-500">Careers</Link></li>
              <li><Link href="/location" className="hover:text-brand-500">Our Location</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500">Contact</Link></li>
            </ul>
            <EmailLink
              email={c.contact.careersEmail}
              className="mt-5 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 hover:text-brand-400"
            >
              Apply: {c.contact.careersEmail} <ArrowRight className="h-3 w-3" />
            </EmailLink>
          </div>

          <div>
            <h4 className="font-display text-base uppercase tracking-[0.2em] text-silver-100">Contact</h4>
            <ul className="mt-4 space-y-3 font-sans text-sm text-silver-200">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-600 flex-shrink-0" />
                <span>{c.contact.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="hover:text-brand-500">{c.contact.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <EmailLink email={c.contact.email} className="hover:text-brand-500" />
              </li>
              <li>
                <a
                  href={`https://wa.me/${c.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 mt-1 text-brand-500 hover:text-brand-400 underline-offset-4 hover:underline"
                >
                  WhatsApp Us →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-500 pt-6 font-sans text-xs text-silver-500 md:flex-row md:items-center">
          <p>© {year} Norvex Sports. All rights reserved.</p>
          <p className="uppercase tracking-[0.2em]">Hyderabad · Telangana · India</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center border border-ink-500 bg-ink-800 text-silver-200 transition hover:border-brand-600 hover:text-brand-500"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
