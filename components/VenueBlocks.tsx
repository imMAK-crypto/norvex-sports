import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { getVenues } from '@/lib/venue';
import { Section } from '@/components/Section';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

/**
 * "Our Locations" preview — admin-managed venues rendered as clickable blocks.
 * Every block links to /location, and because the list comes straight from
 * getVenues(), any venue added in the admin panel shows up here automatically.
 * Renders nothing when no venues exist yet.
 */
export async function VenueBlocks({ className = '' }: { className?: string }) {
  const venues = await getVenues();
  if (venues.length === 0) return null;

  return (
    <Section eyebrow="Where we train" title="Our Locations" align="center" className={className}>
      <div className={`grid gap-5 md:grid-cols-2 ${centerGridClass('lg')}`}>
        {venues.map((v, i) => (
          <Link
            key={v.id}
            href="/location"
            className={`card-accent group flex flex-col ${centerCardSpan('lg')} ${centerLastRow('lg', i, venues.length)}`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 group-hover:bg-brand-600 group-hover:text-silver-100 transition">
                <MapPin className="h-5 w-5" />
              </div>
              {v.isPrimary && (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600 border border-brand-600/30 bg-brand-600/10 px-2 py-1">
                  Main Academy
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl text-silver-100 uppercase">{v.name}</h3>
            {v.address && <p className="mt-2 text-sm text-silver-400 line-clamp-3">{v.address}</p>}
            <span className="mt-auto pt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 group-hover:text-brand-500">
              View Location <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/location" className="btn-outline">Explore Our Locations →</Link>
      </div>
    </Section>
  );
}
