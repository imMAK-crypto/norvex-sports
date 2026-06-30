import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { prisma, safeQuery, type NewsPostModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, newsListLd } from '@/lib/seo';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

export const metadata: Metadata = pageMeta({
  title: 'News & Updates',
  description: 'Latest match results, player achievements, event announcements and academy updates from Norvex Sports.',
  path: '/news',
});

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await safeQuery<NewsPostModel[]>(
    () =>
      prisma.newsPost.findMany({
        where: { isPublished: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
    [],
  );

  return (
    <>
      {posts.length > 0 && <JsonLd data={newsListLd(posts)} />}
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'News', path: '/news' }]} />
      <PageHeader
        eyebrow="News & updates"
        title="Stay in the loop."
        intro="Match results, player milestones, event announcements and the academy story — all in one place."
      />

      <Section>
        {posts.length === 0 ? (
          <p className="text-center text-silver-400 py-12">No news yet — check back soon.</p>
        ) : (
          <div className={`grid gap-6 md:grid-cols-2 ${centerGridClass('lg')}`}>
            {posts.map((p, i) => (
              <Link
                key={p.id}
                href={`/news/${p.slug}`}
                className={`group flex flex-col overflow-hidden bg-ink-800 rounded-xl transition hover:-translate-y-1 ${centerCardSpan('lg')} ${centerLastRow('lg', i, posts.length)}`}
              >
                {/* IMAGE + OVERLAY TITLE */}
                <div className="relative aspect-[16/10] w-full bg-ink-700 overflow-hidden">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-display text-7xl text-brand-600/30">N</div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-brand-500 font-semibold">
                      News
                    </span>
                    <h3 className="font-display text-xl md:text-2xl uppercase text-silver-100 leading-tight">
                      {p.title}
                    </h3>
                  </div>
                </div>
                {/* BODY — no date */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-silver-200 leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
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
