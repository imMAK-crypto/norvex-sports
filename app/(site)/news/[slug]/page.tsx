import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';

type Params = { params: { slug: string } };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const items = await prisma.newsPost.findMany({ where: { isPublished: true }, select: { slug: true } });
    return items.map((i) => ({ slug: i.slug }));
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
      <header className="relative overflow-hidden border-b border-ink-500 bg-ink-900">
        <div className="container-x py-16 md:py-20">
          <Link href="/news" className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-silver-500 hover:text-brand-500">
            <ArrowLeft className="h-3 w-3" /> All News
          </Link>
          {post.publishedAt && (
            <time className="mt-6 block font-sans text-[11px] uppercase tracking-[0.2em] text-brand-600">
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h1 className="headline mt-3 text-4xl md:text-5xl text-silver-100 leading-tight">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-silver-300">{post.excerpt}</p>
        </div>
      </header>

      <Section>
        <article className="mx-auto max-w-3xl">
          {post.imageUrl && (
            <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-ink-500">
              <Image src={post.imageUrl} alt={post.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="prose-norvex text-base md:text-lg">
            {post.body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {post.author && (
            <p className="mt-12 pt-6 border-t border-ink-500 font-sans text-sm text-silver-500">
              — {post.author}
            </p>
          )}
        </article>
      </Section>
    </>
  );
}
