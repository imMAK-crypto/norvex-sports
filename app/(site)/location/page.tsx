import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { getVenues } from '@/lib/venue';
import { pageMeta, webPageLd, venuesLd } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { VenueBlocks } from '@/components/VenueBlocks';

export const metadata: Metadata = pageMeta({
  title: 'Our Location',
  description:
    'Norvex Sports is based in Hyderabad, Telangana — serving players across the city with structured training and competitive exposure.',
  path: '/location',
  keywords: ['football academy Hyderabad location', 'football training near me Hyderabad', 'Norvex Sports Hyderabad'],
});

export default async function LocationPage() {
  const [s, venues] = await Promise.all([
    getSettings([
      'location.eyebrow', 'location.title', 'location.intro',
      'location.outroTitle', 'location.outro',
    ]),
    getVenues(),
  ]);

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

      {/* OUR LOCATIONS — clickable blocks, each opens the venue on Google Maps */}
      <VenueBlocks showExplore={false} className="bg-ink-900 border-y border-ink-500" />

      <Section eyebrow="What's next" title={s['location.outroTitle']} className="bg-ink-900 border-y border-ink-500" align="center">
        <div className="mx-auto max-w-2xl text-center text-silver-300">
          {s['location.outro']}
        </div>
      </Section>
    </>
  );
}
