import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';

type Params = { params: { slug: string } };

export async function generateStaticParams() {
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
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s || !s.isActive) notFound();

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
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <div className="flex items-center gap-3 text-sm text-white/50">
            <Link href="/services" className="hover:text-brand-400">Services</Link>
            <span>/</span>
            <span className="text-white/80">{s.title}</span>
          </div>
          <h1 className="headline mt-4 text-5xl md:text-6xl">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{s.shortDesc}</p>
          <div className="mt-8">
            <Link href="/contact#trial" className="btn-primary">Book a Free Trial</Link>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            {s.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
                <img src={s.imageUrl} alt={s.title} className="w-full" />
              </div>
            )}
            <div className="prose-norvex">
              {s.longDesc.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <aside className="card h-fit">
            <h3 className="font-display text-xl text-brand-400">Get started</h3>
            <p className="mt-2 text-sm text-white/70">
              Book a free trial session — meet the coaches and try it out, no pressure.
            </p>
            <Link href="/contact#trial" className="btn-outline mt-4 w-full">Book Trial</Link>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section eyebrow="More programs" title="Explore other services." className="bg-white/[0.02]">
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} href={`/services/${r.slug}`} className="card group">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-3">
                  <Icon name={r.icon ?? 'trophy'} />
                </div>
                <h3 className="font-display text-xl text-white">{r.title}</h3>
                <p className="mt-2 text-sm text-white/70">{r.shortDesc}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
