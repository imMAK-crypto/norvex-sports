import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { getSiteContent, getSettings } from '@/lib/settings';
import { pageMeta, faqLd, SITE_FAQ, ORG_KEYWORDS, webPageLd } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { ContactForm } from '@/components/ContactForm';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmailLink } from '@/components/EmailLink';
import { JsonLd } from '@/components/JsonLd';
import { VenueBlocks } from '@/components/VenueBlocks';

export const metadata: Metadata = pageMeta({
  title: 'Contact Us — Book a Free Trial',
  description: 'Get in touch with Norvex Sports — book a free trial, ask about programs, or enquire about events and birthday parties.',
  path: '/contact',
  keywords: [
    'contact Norvex Sports',
    'book football trial Hyderabad',
    'free football trial',
    'football academy enquiry Hyderabad',
    ...ORG_KEYWORDS.slice(0, 6),
  ],
});

export const revalidate = 300;

export default async function ContactPage() {
  const [c, s] = await Promise.all([
    getSiteContent(),
    getSettings(['contact.eyebrow', 'contact.title', 'contact.intro', 'contact.responseTime']),
  ]);
  const phoneTel = c.contact.phone.replace(/\s/g, '');

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: '/contact',
            type: 'ContactPage',
            name: 'Contact Norvex Sports — Book a Free Trial',
            description:
              'Get in touch with Norvex Sports in Hyderabad — book a free football trial, ask about programs, events or birthday parties.',
          }),
          faqLd(),
        ]}
      />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
      <PageHeader
        eyebrow={s['contact.eyebrow']}
        title={s['contact.title']}
        intro={s['contact.intro']}
      />

      <Section id="trial">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-ink-500 bg-ink-800 p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-3xl uppercase tracking-wide text-silver-100">Enquiry Form</h2>
                <span className="inline-flex items-center gap-2 rounded-md border border-brand-600/40 bg-brand-600/10 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" /> Free Trial Available
                </span>
              </div>
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <a href={`tel:${phoneTel}`} className="flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Phone</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">{c.contact.phone}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/${c.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600"><MessageCircle className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">WhatsApp</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">Chat with us</p>
              </div>
            </a>
            <EmailLink email={c.contact.email} className="flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Email</p>
                <p className="font-display text-lg break-all text-silver-100">{c.contact.email}</p>
              </div>
            </EmailLink>
            <div className="flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600"><MapPin className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Location</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">{c.contact.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600"><Clock className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Response Time</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">{s['contact.responseTime']}</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* FAQ — visible content backing the FAQPage schema (required for rich results) */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-600">FAQ</p>
          <h2 className="headline mt-2 text-3xl md:text-4xl text-silver-100">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-ink-500 border-y border-ink-500">
            {SITE_FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-silver-100 marker:content-none">
                  {f.q}
                  <span className="shrink-0 text-brand-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-base text-silver-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* OUR LOCATIONS */}
      <VenueBlocks className="bg-ink-900 border-y border-ink-500" />

      {/* OUR LOCATIONS */}
      <VenueBlocks className="bg-ink-900 border-y border-ink-500" />

      {/* CTA strip */}
      <section className="bg-brand-600">
        <div className="container-x py-10 md:py-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-silver-100">
            Book a Trial Session · Contact Us Now
          </h2>
          <p className="mt-2 font-sans text-sm text-silver-100/80">
            First session is on us. Just bring your boots.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`tel:${phoneTel}`} className="inline-flex items-center bg-silver-100 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-brand-600 transition hover:bg-silver-100">
              <Phone className="mr-2 h-4 w-4" /> Call {c.contact.phone}
            </a>
            <a
              href={`https://wa.me/${c.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center border-2 border-silver-100 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-silver-100 transition hover:bg-silver-100 hover:text-brand-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
