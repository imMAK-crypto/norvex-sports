import Link from 'next/link';
import { prisma, safeQuery } from '@/lib/prisma';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { Icon } from '@/components/Icon';

export const revalidate = 60;

export default async function HomePage() {
  const c = await getSiteContent();
  const [services, events, news] = await Promise.all([
    safeQuery(() => prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }), [] as never[]),
    safeQuery(() => prisma.event.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 3 }), [] as never[]),
    safeQuery(() => prisma.newsPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 3 }), [] as never[]),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden grid-bg">
        <div className="container-x relative pt-16 pb-24 md:pt-28 md:pb-36">
          <div className="max-w-3xl">
            <span className="eyebrow">Hyderabad · Est. 2026</span>
            <h1 className="headline mt-4 text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
              Football <span className="text-brand-400">development</span>,
              <br />
              done professionally.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              {c.tagline} Structured pathways from grassroots to elite — expert coaching,
              competitive exposure, and a culture built on discipline and consistency.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#trial" className="btn-primary">
                Book a Free Trial
                <Icon name="arrow-right" className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-outline">Explore Programs</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/60">
              <Stat n="8+" label="Programs" />
              <Stat n="4" label="Co-Founders" />
              <Stat n="All Ages" label="Grassroots → Elite" />
              <Stat n="1:1" label="Personal Coaching" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-[-10%] hidden w-2/3 md:block opacity-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(26,165,75,0.35),transparent_60%)]" />
        </div>
      </section>

      {/* Values strip */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
          <span>Discipline</span><span className="text-brand-500">·</span>
          <span>Growth</span><span className="text-brand-500">·</span>
          <span>Respect</span><span className="text-brand-500">·</span>
          <span>Excellence</span><span className="text-brand-500">·</span>
          <span>Sports for Everyone</span>
        </div>
      </section>

      {/* About preview */}
      <Section eyebrow="The Norvex Project" title="More than training — a pathway.">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="prose-norvex">
            <p>{c.aboutShort}</p>
            <p>
              What began as a grassroots initiative has grown into a structured platform offering academy training,
              one-to-one coaching, and team building to achieve competitive opportunities.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center text-brand-400 hover:text-brand-300">
              Read our story <Icon name="arrow-right" className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: 'Technical', d: 'First touch, passing, finishing — the fundamentals, done right.' },
              { t: 'Tactical', d: 'Game awareness, decision-making, position-specific intelligence.' },
              { t: 'Physical', d: 'Strength, speed, agility — sports-science backed conditioning.' },
              { t: 'Mental', d: 'Discipline, consistency, and competitive mindset.' },
            ].map((p) => (
              <div key={p.t} className="card">
                <h3 className="font-display text-2xl text-brand-400">{p.t}</h3>
                <p className="mt-2 text-sm text-white/70">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section eyebrow="What we offer" title="Programs for every player." className="bg-white/[0.02]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="card group">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-black transition">
                <Icon name={s.icon ?? 'trophy'} />
              </div>
              <h3 className="font-display text-2xl text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70">{s.shortDesc}</p>
              <span className="mt-4 inline-flex items-center text-sm text-brand-400">
                Learn more <Icon name="arrow-right" className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn-outline">View All Services</Link>
        </div>
      </Section>

      {/* Events */}
      <Section eyebrow="What's on" title="Events & programs.">
        <div className="grid gap-5 md:grid-cols-3">
          {events.length === 0 ? (
            <p className="col-span-full text-center text-white/60">Stay tuned for upcoming events and registrations.</p>
          ) : (
            events.map((e) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="card overflow-hidden p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-700/30 to-ink-900">
                  {e.imageUrl ? (
                    <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-brand-500/30 text-7xl font-display">N</div>
                  )}
                </div>
                <div className="p-5">
                  {e.category && <span className="eyebrow">{e.category}</span>}
                  <h3 className="font-display text-xl text-white mt-2">{e.title}</h3>
                  <p className="mt-1 text-sm text-white/60 line-clamp-2">{e.summary}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="mt-10 text-center">
          <Link href="/events" className="btn-outline">All Events</Link>
        </div>
      </Section>

      {/* Latest news */}
      {news.length > 0 && (
        <Section eyebrow="News & updates" title="Latest from Norvex." className="bg-white/[0.02]">
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="card group">
                <h3 className="font-display text-xl text-white group-hover:text-brand-400 transition">{n.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-3">{n.excerpt}</p>
                <span className="mt-4 inline-flex items-center text-sm text-brand-400">
                  Read <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-br from-brand-700/30 via-ink-900 to-ink-950">
        <div className="container-x py-16 md:py-24 text-center">
          <span className="eyebrow">Start your journey</span>
          <h2 className="headline mt-3 text-4xl md:text-6xl">Your first session is free.</h2>
          <p className="mt-4 max-w-xl mx-auto text-white/70">
            Book a free trial and meet the Norvex coaching team. No pressure — just football.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact#trial" className="btn-primary">Book a Free Trial</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-brand-400 leading-none">{n}</div>
      <div className="mt-1 text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}
