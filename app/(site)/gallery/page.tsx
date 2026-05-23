import type { Metadata } from 'next';
import { prisma, safeQuery, type GalleryItemModel } from '@/lib/prisma';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Moments from Norvex Sports — training sessions, match days, events, and celebrations.',
};

export const revalidate = 60;

export default async function GalleryPage({ searchParams }: { searchParams?: { cat?: string } }) {
  const items = await safeQuery<GalleryItemModel[]>(
    () => prisma.galleryItem.findMany({
      where: { isActive: true, ...(searchParams?.cat ? { category: searchParams.cat } : {}) },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    [],
  );
  const allCategories = await safeQuery<Array<{ category: string }>>(
    () => prisma.galleryItem.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    }),
    [],
  );
  const categories = ['All', ...allCategories.map((c) => c.category).filter(Boolean)];
  const selected = searchParams?.cat ?? 'All';

  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Gallery</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Energy. Passion. Progress.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Moments from Norvex Sports — training sessions, match days, events, and the unforgettable details of the journey.
          </p>
        </div>
      </header>

      <Section>
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === selected || (c === 'All' && !searchParams?.cat);
              const href = c === 'All' ? '/gallery' : `/gallery?cat=${encodeURIComponent(c)}`;
              return (
                <a key={c} href={href} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${active ? 'bg-brand-500 text-black' : 'border border-white/15 text-white/70 hover:text-white'}`}>
                  {c}
                </a>
              );
            })}
          </div>
        )}
        {items.length === 0 ? (
          <p className="text-center text-white/60">Gallery coming soon — check back after launch.</p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((g) => (
              <figure key={g.id} className="break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <img src={g.imageUrl} alt={g.title} loading="lazy" className="w-full" />
                {(g.title || g.caption) && (
                  <figcaption className="p-3 text-xs text-white/60">
                    <span className="text-white">{g.title}</span>
                    {g.caption && <span> — {g.caption}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
