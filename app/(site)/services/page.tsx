import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';
import { prisma, safeQuery, type ServiceModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { siteUrl } from '@/lib/settings';
import { pageMeta } from '@/lib/seo';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

export const metadata: Metadata = pageMeta({
  title: 'Football Training Programs & Services',
  description:
    'Football development, one-to-one coaching, advanced player development, adult training, tournament organization, school programs, fitness, and trials.',
  path: '/services',
});

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await safeQuery<ServiceModel[]>(
    () => prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    [],
  );

  const url = siteUrl();
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Norvex Sports — Football Training Programs & Services',
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${url}/services/${s.slug}`,
      item: {
        '@type': 'Service',
        '@id': `${url}/services/${s.slug}#service`,
        name: s.title,
        description: s.shortDesc,
        url: `${url}/services/${s.slug}`,
        ...(s.imageUrl ? { image: [s.imageUrl] } : {}),
        provider: { '@id': `${url}/#organization` },
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]} />
      <PageHeader
        eyebrow="Our services"
        title="Programs for every player."
        intro="A complete range of football training and development programs — designed for players of all ages and skill levels."
      />

      <Section>
        <div className={`grid gap-5 md:grid-cols-2 ${centerGridClass('lg')}`}>
          {services.map((s, i) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className={`group flex flex-col overflow-hidden bg-ink-800 rounded-xl transition hover:-translate-y-1 ${centerCardSpan('lg')} ${centerLastRow('lg', i, services.length)}`}
            >
              {/* IMAGE + OVERLAY TITLE */}
              <div className="relative aspect-[16/10] w-full bg-ink-800 overflow-hidden">
                {s.imageUrl ? (
                  <Image
                    src={s.imageUrl}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center font-display text-7xl text-brand-600/30">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                )}
                {/* Dark gradient bottom-of-image so the title is always readable */}
                <div
                  className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, transparent 100%)',
                  }}
                />
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex items-center gap-2 mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-brand-500">
                    <Trophy className="h-3 w-3" /> {String(i + 1).padStart(2, '0')} · Service
                  </span>
                  <h3 className="font-display text-xl md:text-2xl uppercase text-silver-100 leading-tight">
                    {s.title}
                  </h3>
                </div>
              </div>
              {/* BODY */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-silver-200 leading-relaxed flex-1">{s.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 group-hover:text-brand-400 transition">
                  Learn More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
