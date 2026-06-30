import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma, safeQuery, type GalleryItemModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, galleryLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Gallery',
  description: 'Moments from Norvex Sports — training sessions, match days, events, and celebrations.',
  path: '/gallery',
});

export const revalidate = 60;

const ALL_CATEGORIES = [
  'Training Sessions',
  'Match Day Action',
  'Team Photos',
  'Events and Tournaments',
  'Player Highlights',
  'Facilities and Infrastructure',
  'Kids Training',
  'Coaches Interacting',
  'Match Moments',
  'Celebrations',
];

export default async function GalleryPage({ searchParams }: { searchParams?: { cat?: string } }) {
  const cat = searchParams?.cat;
  const items = await safeQuery<GalleryItemModel[]>(
    () =>
      prisma.galleryItem.findMany({
        where: { isActive: true, ...(cat ? { category: cat } : {}) },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    [],
  );

  const dbCats = await safeQuery<Array<{ category: string }>>(
    () =>
      prisma.galleryItem.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ['category'],
      }),
    [],
  );

  const presentCats = new Set(dbCats.map((c) => c.category).filter(Boolean));
  const categories = ['All', ...ALL_CATEGORIES.filter((c) => presentCats.has(c))];
  const selected = cat ?? 'All';

  return (
    <>
      {items.length > 0 && <JsonLd data={galleryLd(items)} />}
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }]} />
      <PageHeader
        eyebrow="Gallery"
        title="Energy. Passion. Progress."
        intro="Moments from Norvex Sports — training, match days, events, and the unforgettable details of the journey."
      />

      <Section>
        {/* Filter bar */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === selected || (c === 'All' && !cat);
              const href = c === 'All' ? '/gallery' : `/gallery?cat=${encodeURIComponent(c)}`;
              return (
                <Link
                  key={c}
                  href={href}
                  className={`border px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-silver-100'
                      : 'border-ink-500 bg-ink-800 text-silver-300 hover:border-brand-600 hover:text-silver-100'
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        )}

        {items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-ink-500 bg-ink-800 grid place-items-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-silver-600">Coming soon</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {items.map((g) => (
              <figure key={g.id} className="relative group aspect-square overflow-hidden rounded-xl border border-ink-500 bg-ink-800">
                <Image
                  src={g.imageUrl}
                  alt={g.title ?? 'Norvex Sports gallery'}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition group-hover:scale-105"
                />
                {(g.title || g.caption) && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 to-transparent px-3 py-3 opacity-0 group-hover:opacity-100 transition">
                    {g.title && <div className="font-sans text-sm font-semibold text-silver-100">{g.title}</div>}
                    {g.caption && <div className="font-sans text-xs text-silver-300">{g.caption}</div>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </Section>

      {/* Video section placeholder */}
      <Section eyebrow="Video reel" title="Watch Norvex in Action" align="center" className="bg-ink-900 border-y border-ink-500">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-video rounded-xl border border-ink-500 bg-ink-800 grid place-items-center overflow-hidden">
            <div className="text-center">
              <div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-brand-600/20 border-2 border-brand-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-brand-600 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-silver-500">Video reel — coming soon</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
