import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma, safeQuery } from '@/lib/prisma';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Events & Programs',
  description:
    'Norvex Youth League, development clinics, talent trials, friendly matches, seasonal tournaments and football-themed birthday parties.',
};

export const revalidate = 60;

function fmtDate(d: Date | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function EventsPage() {
  const events = await safeQuery(
    () => prisma.event.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }],
    }),
    [] as Awaited<ReturnType<typeof prisma.event.findMany>>,
  );

  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Events & programs</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Compete. Showcase. Celebrate.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Stay tuned for upcoming events and registrations. Real match experience, competitive exposure, and the
            kind of nights every young player remembers.
          </p>
        </div>
      </header>

      <Section>
        {events.length === 0 ? (
          <p className="text-center text-white/60">Stay tuned for upcoming events and registrations.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="card overflow-hidden p-0 group">
                <div className="aspect-[16/10] bg-gradient-to-br from-brand-700/30 to-ink-900">
                  {e.imageUrl ? (
                    <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-brand-500/20 text-7xl font-display">N</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs">
                    {e.category && <span className="eyebrow">{e.category}</span>}
                    {fmtDate(e.date) && <span className="text-white/50">· {fmtDate(e.date)}</span>}
                  </div>
                  <h3 className="font-display text-2xl text-white mt-2">{e.title}</h3>
                  <p className="mt-1 text-sm text-white/60 line-clamp-3">{e.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
