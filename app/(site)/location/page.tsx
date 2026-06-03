import type { Metadata } from 'next';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Our Location',
  description:
    'Norvex Sports is based in Hyderabad, Telangana — serving players across the city with structured training and competitive exposure.',
};

export default async function LocationPage() {
  const c = await getSiteContent();
  return (
    <>
      <PageHeader
        eyebrow="Our location"
        title="Built in Hyderabad."
        intro="Currently based in Hyderabad, Telangana — building a strong football development ecosystem. As we grow, we plan to expand to multiple locations and cities."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <div className="border border-ink-500 bg-ink-800 p-6">
              <div className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl uppercase text-silver-100">{c.contact.location}</h3>
              <p className="mt-2 text-sm text-silver-300">
                We serve players across different areas of the city, making quality football training accessible.
              </p>
            </div>
            <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Phone</p>
                <p className="font-display text-lg text-silver-100">{c.contact.phone}</p>
              </div>
            </a>
            <a href={`mailto:${c.contact.email}`} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Email</p>
                <p className="font-display text-lg break-all text-silver-100">{c.contact.email}</p>
              </div>
            </a>
          </div>
          <div className="overflow-hidden border border-ink-500 min-h-[400px]">
            <iframe
              title="Norvex Sports — Hyderabad"
              src="https://www.google.com/maps?q=Hyderabad,Telangana&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>
      </Section>

      <Section eyebrow="What's next" title="Expanding outward." className="bg-ink-900 border-y border-ink-500" align="center">
        <div className="mx-auto max-w-2xl text-center text-silver-300">
          As we grow, we plan to expand our presence to multiple locations and cities — bringing structured sports
          development programs to a wider community of athletes across India.
        </div>
      </Section>
    </>
  );
}
