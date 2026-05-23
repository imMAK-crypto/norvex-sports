import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma, safeQuery, type NewsPostModel } from '@/lib/prisma';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest match results, player achievements, event announcements and academy updates from Norvex Sports.',
};

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await safeQuery<NewsPostModel[]>(
    () => prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    }),
    [],
  );

  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">News & updates</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Stay in the loop.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Match results, player milestones, event announcements and the academy story — all in one place.
          </p>
        </div>
      </header>

      <Section>
        {posts.length === 0 ? (
          <p className="text-center text-white/60">No news yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/news/${p.slug}`} className="card group">
                {p.imageUrl && (
                  <div className="-m-6 mb-4 aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                )}
                {p.publishedAt && (
                  <time className="eyebrow text-white/40">
                    {new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </time>
                )}
                <h3 className="mt-2 font-display text-2xl text-white group-hover:text-brand-400 transition">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-3">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
