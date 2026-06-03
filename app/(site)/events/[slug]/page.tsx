import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { siteUrl } from '@/lib/settings';

type Params = { params: { slug: string } };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const items = await prisma.event.findMany({ where: { isActive: true }, select: { slug: true } });
    return items.map((i) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await prisma.event.findUnique({ where: { slug: params.slug } });
  if (!e) return { title: 'Not found' };
  return {
    title: e.metaTitle ?? e.title,
    description: e.metaDescription ?? e.summary,
    alternates: { canonical: `${siteUrl()}/events/${e.slug}` },
    openGraph: {
      title: e.title,
      description: e.summary,
      images: e.imageUrl ? [{ url: e.imageUrl }] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function EventDetail({ params }: Params) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } });
  if (!event || !event.isActive) return notFound();
  const e = event;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.summary,
    startDate: e.date?.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: e.location
      ? { '@type': 'Place', name: e.location, address: 'Hyderabad, Telangana, India' }
      : { '@type': 'Place', name: 'Hyderabad', address: 'Hyderabad, Telangana, India' },
    image: e.imageUrl,
    organizer: { '@type': 'Organization', name: 'Norvex Sports', url: siteUrl() },
  };

  return (
    <>
      <JsonLd data={ld} />
      <header className="relative overflow-hidden border-b border-ink-500 bg-ink-900">
        <div className="container-x py-16 md:py-20">
          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.18em] text-silver-500">
            <Link href="/events" className="hover:text-brand-500">Events</Link>
            <span>/</span>
            <span className="text-silver-300">{e.title}</span>
          </div>
          <h1 className="headline mt-4 text-4xl md:text-6xl text-silver-100 leading-tight">{e.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-silver-300">{e.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {e.registrationUrl && (
              <a href={e.registrationUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">Register</a>
            )}
            <Link href="/contact" className="btn-outline">Enquire</Link>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {e.imageUrl && (
              <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-ink-500">
                <Image src={e.imageUrl} alt={e.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
            )}
            <div className="prose-norvex">
              {e.description.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {e.galleryUrls && e.galleryUrls.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
                {e.galleryUrls.map((u, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden border border-ink-500">
                    <Image src={u} alt={`${e.title} ${i + 1}`} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="border border-ink-500 border-t-[3px] border-t-brand-600 bg-ink-800 p-6 h-fit lg:sticky lg:top-28">
            <h3 className="font-display text-xl uppercase text-silver-100">Event Details</h3>
            <dl className="mt-4 space-y-4 text-sm">
              {e.category && (
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-0.5 text-brand-600" />
                  <div>
                    <dt className="text-silver-500 uppercase tracking-[0.15em] text-[10px] font-semibold">Category</dt>
                    <dd className="text-silver-100 font-display text-lg uppercase">{e.category}</dd>
                  </div>
                </div>
              )}
              {e.date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-brand-600" />
                  <div>
                    <dt className="text-silver-500 uppercase tracking-[0.15em] text-[10px] font-semibold">Date</dt>
                    <dd className="text-silver-100 font-display text-lg">{e.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                  </div>
                </div>
              )}
              {e.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-brand-600" />
                  <div>
                    <dt className="text-silver-500 uppercase tracking-[0.15em] text-[10px] font-semibold">Location</dt>
                    <dd className="text-silver-100 font-display text-lg">{e.location}</dd>
                  </div>
                </div>
              )}
            </dl>
            {e.registrationUrl && (
              <a href={e.registrationUrl} target="_blank" rel="noreferrer noopener" className="btn-primary mt-6 w-full">Register Now</a>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
