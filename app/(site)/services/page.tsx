import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma, safeQuery, type ServiceModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Football Training Programs & Services',
  description:
    'Football development, one-to-one coaching, advanced player development, adult training, tournament organization, school programs, fitness, and trials.',
};

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
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${url}/services/${s.slug}`,
      name: s.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Our services</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Programs for every player.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            A complete range of football training and development programs — designed for players of all ages and
            skill levels.
          </p>
        </div>
      </header>

      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="card group flex flex-col">
              {s.imageUrl ? (
                <div className="-m-6 mb-4 aspect-[16/10] overflow-hidden rounded-t-2xl">
                  <img src={s.imageUrl} alt={s.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
              ) : (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-4 group-hover:bg-brand-500 group-hover:text-black transition">
                  <Icon name={s.icon ?? 'trophy'} />
                </div>
              )}
              <h3 className="font-display text-2xl text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70 flex-1">{s.shortDesc}</p>
              <span className="mt-4 inline-flex items-center text-sm text-brand-400">
                Learn more <Icon name="arrow-right" className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
