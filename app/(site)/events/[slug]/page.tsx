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
    const items = await prisma.event.findMany({ where: { isActive: true }, select: { slug: true } });
    return items.map((i: { slug: string }) => ({ slug: i.slug }));
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
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <div className="flex items-center gap-3 text-sm text-white/50">
            <Link href="/events" className="hover:text-brand-400">Events</Link>
            <span>/</span>
            <span className="text-white/80">{e.title}</span>
          </div>
          <h1 className="headline mt-4 text-5xl md:text-6xl">{e.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{e.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {e.registrationUrl && (
              <a href={e.registrationUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
                Register
              </a>
            )}
            <Link href="/contact" className="btn-outline">Enquire</Link>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            {e.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
                <img src={e.imageUrl} alt={e.title} className="w-full" />
              </div>
            )}
            <div className="prose-norvex">
              {e.description.split(/\n\s*\n/).map((p: string, i: number) => <p key={i}>{p}</p>)}
            </div>
            {e.galleryUrls && e.galleryUrls.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
                {e.galleryUrls.map((u: string, i: number) => (
                  <img key={i} src={u} alt={`${e.title} ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                ))}
              </div>
            )}
          </div>
          <aside className="card h-fit">
            <h3 className="font-display text-xl text-brand-400">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {e.category && (<div><dt className="text-white/50">Category</dt><dd className="text-white">{e.category}</dd></div>)}
              {e.date && (<div><dt className="text-white/50">Date</dt><dd className="text-white">{e.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>)}
              {e.location && (<div><dt className="text-white/50">Location</dt><dd className="text-white">{e.location}</dd></div>)}
            </dl>
          </aside>
        </div>
      </Section>
    </>
  );
}
