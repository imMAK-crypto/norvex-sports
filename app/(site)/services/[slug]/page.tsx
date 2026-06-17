import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Trophy } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

type Params = { params: { slug: string } };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const items = await prisma.service.findMany({ where: { isActive: true }, select: { slug: true } });
    return items.map((i) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s) return { title: 'Not found' };
  return {
    title: s.metaTitle ?? s.title,
    description: s.metaDescription ?? s.shortDesc,
    alternates: { canonical: `${siteUrl()}/services/${s.slug}` },
    openGraph: {
      title: s.title,
      description: s.shortDesc,
      images: s.imageUrl ? [{ url: s.imageUrl }] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ServiceDetail({ params }: Params) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service || !service.isActive) return notFound();
  const s = service;

  const related = await prisma.service.findMany({
    where: { isActive: true, NOT: { id: s.id } },
    orderBy: { order: 'asc' },
    take: 3,
  });

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.shortDesc,
    provider: { '@type': 'SportsActivityLocation', name: 'Norvex Sports', url: siteUrl() },
    areaServed: 'Hyderabad, India',
  };

  return (
    <>
      <JsonLd data={ld} />
      <header className="relative overflow-hidden border-b border-ink-500 bg-ink-900">
        <div className="container-x py-16 md:py-20">
          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.18em] text-silver-500">
            <Link href="/services" className="hover:text-brand-500">Services</Link>
            <span>/</span>
            <span className="text-silver-300">{s.title}</span>
          </div>
          <h1 className="headline mt-4 text-4xl md:text-6xl text-silver-100 leading-tight">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-silver-300">{s.shortDesc}</p>
          <div className="mt-8">
            <Link href="/contact#trial" className="btn-primary">Book a Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {s.imageUrl && (
              <div className="relative aspect-[16/9] mb-8 overflow-hidden rounded-xl border border-ink-500">
                <Image src={s.imageUrl} alt={s.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
            )}
            <div className="prose-norvex">
              {s.longDesc.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <aside className="border border-ink-500 border-t-[3px] border-t-brand-600 bg-ink-800 p-6 h-fit lg:sticky lg:top-28">
            <h3 className="font-display text-xl uppercase text-silver-100">Get Started</h3>
            <p className="mt-2 text-sm text-silver-300">
              Book a free trial session — meet the coaches and try it out, no pressure.
            </p>
            <Link href="/contact#trial" className="btn-primary mt-4 w-full">Book Trial</Link>
            <Link href="/contact" className="btn-outline mt-3 w-full">Ask a Question</Link>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section eyebrow="More programs" title="Explore other services." className="bg-ink-900 border-y border-ink-500">
          <div className={`grid gap-5 ${centerGridClass('md')}`}>
            {related.map((r, i) => (
              <Link key={r.id} href={`/services/${r.slug}`} className={`card-accent group ${centerCardSpan('md')} ${centerLastRow('md', i, related.length)}`}>
                <div className="grid h-10 w-10 place-items-center bg-brand-600/10 text-brand-600 mb-3 group-hover:bg-brand-600 group-hover:text-silver-100 transition">
                  <Trophy className="h-4 w-4" />
                </div>
                <h3 className="font-display text-xl uppercase text-silver-100">{r.title}</h3>
                <p className="mt-2 text-sm text-silver-300">{r.shortDesc}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
