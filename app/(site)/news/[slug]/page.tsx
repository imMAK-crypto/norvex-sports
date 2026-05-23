import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';

type Params = { params: { slug: string } };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const items = await prisma.newsPost.findMany({ where: { isPublished: true }, select: { slug: true } });
    return items.map((i: { slug: string }) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await prisma.newsPost.findUnique({ where: { slug: params.slug } });
  if (!p) return { title: 'Not found' };
  return {
    title: p.metaTitle ?? p.title,
    description: p.metaDescription ?? p.excerpt,
    alternates: { canonical: `${siteUrl()}/news/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      type: 'article',
      images: p.imageUrl ? [{ url: p.imageUrl }] : undefined,
      publishedTime: p.publishedAt?.toISOString(),
    },
  };
}

export const revalidate = 60;

export default async function NewsDetail({ params }: Params) {
  const found = await prisma.newsPost.findUnique({ where: { slug: params.slug } });
  if (!found || !found.isPublished) return notFound();
  const post = found;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: post.author ?? 'Norvex Sports' },
    publisher: { '@type': 'Organization', name: 'Norvex Sports', url: siteUrl() },
  };

  return (
    <>
      <JsonLd data={ld} />
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <Link href="/news" className="text-sm text-white/50 hover:text-brand-400">← All news</Link>
          {post.publishedAt && (
            <time className="eyebrow mt-6 block text-white/50">
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h1 className="headline mt-3 text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{post.excerpt}</p>
        </div>
      </header>

      <Section>
        <article className="mx-auto max-w-3xl">
          {post.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
              <img src={post.imageUrl} alt={post.title} className="w-full" />
            </div>
          )}
          <div className="prose-norvex">
            {post.body.split(/\n\s*\n/).map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
        </article>
      </Section>
    </>
  );
}
