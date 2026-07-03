import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { getSiteContent, getSettings } from '@/lib/settings';
import { getVenues } from '@/lib/venue';
import { pageMeta, webPageLd, venuesLd } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { EmailLink } from '@/components/EmailLink';

export const metadata: Metadata = pageMeta({
  title: 'Our Location',
  description:
    'Norvex Sports is based in Hyderabad, Telangana — serving players across the city with structured training and competitive exposure.',
  path: '/location',
  keywords: ['football academy Hyderabad location', 'football training near me Hyderabad', 'Norvex Sports Hyderabad'],
});

export default async function LocationPage() {
  const [c, s, venues] = await Promise.all([
    getSiteContent(),
    getSettings([
      'location.eyebrow', 'location.title', 'location.intro',
      'location.mapEmbed', 'location.outroTitle', 'location.outro',
    ]),
    getVenues(),
  ]);

  const primary = venues.find((v) => v.isPrimary) ?? venues[0] ?? null;
  const others = venues.filter((v) => v.id !== primary?.id);
  // Map shown in the hero slot: the primary venue, else the legacy single embed.
  const heroEmbed = primary?.embedUrl ?? s['location.mapEmbed'];

  const pageLd = webPageLd({
    path: '/location',
    type: 'ContactPage',
    name: 'Our Location — Norvex Sports, Hyderabad',
    description:
      'Norvex Sports is based in Hyderabad, Telangana — serving players across the city with structured training and competitive exposure.',
  });
  const venueGraph = venuesLd(venues);

  return (
    <>
      <JsonLd data={venueGraph ? [pageLd, venueGraph] : pageLd} />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Location', path: '/location' }]} />
      <PageHeader
        eyebrow={s['location.eyebrow']}
        title={s['location.title']}
        intro={s['location.intro']}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <div className="border border-ink-500 bg-ink-800 p-6">
              <div className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl uppercase text-silver-100">
                {primary?.name ?? c.contact.location}
              </h3>
              <p className="mt-2 text-sm text-silver-300">
                {primary?.address ??
                  'We serve players across different areas of the city, making quality football training accessible.'}
              </p>
              {primary && (
                <a
                  href={primary.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-500 hover:text-brand-400"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
              )}
            </div>
            <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Phone</p>
                <p className="font-display text-lg text-silver-100">{c.contact.phone}</p>
              </div>
            </a>
            <EmailLink email={c.contact.email} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Email</p>
                <p className="font-display text-lg break-all text-silver-100">{c.contact.email}</p>
              </div>
            </EmailLink>
          </div>
          <div className="overflow-hidden rounded-xl border border-ink-500 min-h-[400px]">
            <iframe
              title={primary?.name ?? 'Norvex Sports — Hyderabad'}
              src={heroEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>
      </Section>

      {others.length > 0 && (
        <Section eyebrow="Where we train" title="Our Venues" className="bg-ink-900 border-y border-ink-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((v) => (
              <div key={v.id} className="flex flex-col overflow-hidden rounded-xl border border-ink-500 bg-ink-800">
                {v.embedUrl && (
                  <div className="aspect-[16/10] w-full border-b border-ink-500">
                    <iframe
                      title={v.name}
                      src={v.embedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg uppercase text-silver-100">{v.name}</h3>
                  {v.address && <p className="mt-1 text-sm text-silver-400">{v.address}</p>}
                  <a
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-500 hover:text-brand-400"
                  >
                    <Navigation className="h-4 w-4" /> Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section eyebrow="What's next" title={s['location.outroTitle']} className="bg-ink-900 border-y border-ink-500" align="center">
        <div className="mx-auto max-w-2xl text-center text-silver-300">
          {s['location.outro']}
        </div>
      </Section>
    </>
  );
}
