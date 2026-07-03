import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { prisma, safeQuery, type EventModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, webPageLd } from '@/lib/seo';
import { siteUrl } from '@/lib/settings';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

export const metadata: Metadata = pageMeta({
  title: 'Events & Programs',
  description:
    'Norvex Youth League, development clinics, talent trials, friendly matches, seasonal tournaments and football-themed birthday parties.',
  path: '/events',
  keywords: [
    'football events Hyderabad',
    'football tournament Hyderabad',
    'football trials Hyderabad',
    'Norvex Youth League',
    'football league Hyderabad',
  ],
});

export const revalidate = 60;

function fmtDate(d: Date | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function EventsPage() {
  const events = await safeQuery<EventModel[]>(
    () =>
      prisma.event.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }],
      }),
    [],
  );

  const pageLd = webPageLd({
    path: '/events',
    type: 'CollectionPage',
    name: 'Events & Programs — Norvex Sports',
    description:
      'Norvex Youth League, development clinics, talent trials, friendly matches, seasonal tournaments and football-themed birthday parties in Hyderabad.',
  });
  const base = siteUrl();
  const eventsItemList = events.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Norvex Sports — Events & Programs',
        numberOfItems: events.length,
        itemListElement: events.map((e, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${base}/events/${e.slug}`,
          name: e.title,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={eventsItemList ? [pageLd, eventsItemList] : pageLd} />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Events', path: '/events' }]} />
      <PageHeader
        eyebrow="Events & programs"
        title="Compete. Showcase. Celebrate."
        intro="Real match experience, competitive exposure, and the kind of moments every young player remembers."
      />

      {/* Sticky banner */}
      <div className="sticky top-20 md:top-20 z-30 border-b border-brand-600/40 bg-brand-600/15 backdrop-blur-sm">
        <div className="container-x py-3 flex items-center justify-center gap-2 text-center">
          <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            ✦ Stay tuned for upcoming events and registrations
          </span>
        </div>
      </div>

      <Section>
        {events.length === 0 ? (
          <p className="text-center text-silver-400 py-12">
            New events drop in soon — bookmark this page or follow us on Instagram for the latest.
          </p>
        ) : (
          <div className={`grid gap-6 md:grid-cols-2 ${centerGridClass('lg')}`}>
            {events.map((e, i) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className={`group flex flex-col overflow-hidden bg-ink-800 rounded-xl transition hover:-translate-y-1 ${centerCardSpan('lg')} ${centerLastRow('lg', i, events.length)}`}
              >
                {/* IMAGE + OVERLAY TITLE */}
                <div className="relative aspect-[16/10] w-full bg-ink-700 overflow-hidden">
                  {e.imageUrl ? (
                    <Image
                      src={e.imageUrl}
                      alt={e.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-display text-9xl text-brand-600/30">N</div>
                  )}
                  {e.isFeatured && (
                    <span className="absolute top-4 left-4 bg-brand-600 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-silver-100">
                      Featured
                    </span>
                  )}
                  {/* dark gradient for text readability */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {e.category && (
                      <span className="inline-flex items-center gap-1 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-brand-500 font-semibold">
                        <Tag className="h-3 w-3" /> {e.category}
                      </span>
                    )}
                    <h2 className="font-display text-xl md:text-2xl uppercase text-silver-100 leading-tight">
                      {e.title}
                    </h2>
                  </div>
                </div>
                {/* BODY — no date displayed */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-silver-200 leading-relaxed flex-1">{e.summary}</p>
                  {e.location && (
                    <p className="mt-3 inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.15em] text-silver-500">
                      <MapPin className="h-3 w-3" /> {e.location}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 group-hover:text-brand-400 transition">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
