import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Mail, MapPin, MessageCircle, Trophy, Users, Calendar, Activity, Heart, Shield, Award } from 'lucide-react';
import { prisma, safeQuery, type EventModel, type NewsPostModel, type ServiceModel, type GalleryItemModel, type TeamMemberModel } from '@/lib/prisma';
import { getSiteContent } from '@/lib/settings';
import { Section, StatsBar } from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';

export const revalidate = 60;

const HERO_IMG = '/uploads/hero.jpg';
const HERO_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiA5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgZmlsbD0iIzBkMGQwZCIvPjwvc3ZnPg==';

const VALUES = [
  { name: 'Discipline', desc: 'Discipline & Consistency', Icon: Shield },
  { name: 'Development', desc: 'Prioritizing Athlete Development', Icon: Activity },
  { name: 'Integrity', desc: 'Professionalism & Integrity', Icon: Award },
  { name: 'Teamwork', desc: 'Teamwork & Respect', Icon: Users },
  { name: 'Inclusion', desc: 'Sports for Everyone', Icon: Heart },
];

export default async function HomePage() {
  const c = await getSiteContent();
  const [services, events, news, gallery, team] = await Promise.all([
    safeQuery<ServiceModel[]>(() => prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }), []),
    safeQuery<EventModel[]>(() => prisma.event.findMany({ where: { isActive: true }, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }], take: 3 }), []),
    safeQuery<NewsPostModel[]>(() => prisma.newsPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 3 }), []),
    safeQuery<GalleryItemModel[]>(() => prisma.galleryItem.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 8 }), []),
    safeQuery<TeamMemberModel[]>(() => prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 4 }), []),
  ]);

  return (
    <>
      {/* 1 — HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[78vh] min-h-[560px] md:h-[88vh]">
          <Image
            src={HERO_IMG}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={HERO_BLUR}
            quality={72}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 hero-overlay-mobile md:hero-overlay" />
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="container-x pb-12 md:pb-0">
              <div className="max-w-2xl">
                <div className="font-sans text-sm sm:text-base md:text-lg uppercase tracking-[0.35em] text-silver-100">
                  Hyderabad's Premier Football Academy
                </div>
                <h1 className="headline mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-silver-100 leading-[0.95]">
                  Build Your <span className="text-brand-500">Future.</span><br />
                  <span className="text-silver-200">Never Limit.</span><br />
                  <span className="text-silver-200">Never </span><span className="text-brand-500">Settle.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base md:text-lg text-silver-200 leading-relaxed">
                  {c.tagline} Structured pathways from grassroots to elite — expert coaching, competitive exposure, and a culture built on discipline and consistency.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/contact#trial" className="btn-primary">
                    Book a Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href="/services" className="btn-silver">
                    Our Programs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — STATS BAR */}
      <StatsBar
        stats={[
          { num: '8+', label: 'Programs' },
          { num: '10+', label: 'Events' },
          { num: '6', label: 'Days/Week Training' },
          { num: '5★', label: 'Pro Coaching' },
        ]}
      />

      {/* 3 — ABOUT */}
      <Section eyebrow="About Norvex Sports" title="More than training.">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="prose-norvex">
            <p>{c.aboutLong}</p>
            <p>
              What began as a grassroots initiative has grown into a structured platform offering academy training, one-to-one coaching, team building, and competitive opportunities for players of every level.
            </p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 hover:text-brand-500">
              Read Our Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-ink-500">
            <Image
              src="/uploads/more-than-training.jpg"
              alt="Norvex Sports training session"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              quality={72}
              placeholder="blur"
              blurDataURL={HERO_BLUR}
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 4 — THE NORVEX PROJECT */}
      <section className="border-y border-ink-500 bg-ink-900 py-16 md:py-20">
        <div className="container-x text-center">
          <span className="eyebrow">Our Vision</span>
          <h2 className="headline mt-3 text-3xl md:text-5xl text-silver-100">The Norvex Project</h2>
          <p className="mt-6 mx-auto max-w-3xl text-base md:text-lg text-silver-300 leading-relaxed">
            {c.projectStatement}
          </p>
          <Link href="/the-norvex-project" className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 hover:text-brand-500">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5 — VALUES */}
      <section className="py-14 md:py-16">
        <div className="container-x">
          <div className="text-center mb-10">
            <span className="eyebrow">What we stand for</span>
            <h2 className="headline mt-3 text-3xl md:text-4xl text-silver-100">Our Values</h2>
          </div>
          {/* Inline border styles — guaranteed to render on every breakpoint */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {VALUES.map(({ name, desc, Icon }) => (
              <div
                key={name}
                className="flex flex-col items-center justify-center text-center p-6 min-h-[200px]"
                style={{
                  border: '1px solid #2e2e2e',
                  marginLeft: -1,
                  marginTop: -1,
                  background: '#0d0d0d',
                }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-brand-600/40 text-brand-600 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-lg uppercase tracking-wider text-silver-100">{name}</div>
                <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.15em] text-silver-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — SERVICES PREVIEW */}
      <Section eyebrow="What we offer" title="Our Services" align="center" className="bg-ink-900 border-y border-ink-500">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(services.length ? services : DEFAULT_SERVICE_PREVIEW).map((s: any) => (
            <Link
              key={s.id || s.slug}
              href={`/services/${s.slug}`}
              className="card-accent group flex flex-col"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 group-hover:bg-brand-600 group-hover:text-silver-100 transition">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl text-silver-100 uppercase">{s.title}</h3>
              <p className="mt-2 text-sm text-silver-400 line-clamp-3">{s.shortDesc}</p>
              <span className="mt-auto pt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 group-hover:text-brand-500">
                Learn More <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn-outline">View All Services →</Link>
        </div>
      </Section>

      {/* 7 — EVENTS PREVIEW */}
      <Section eyebrow="What's on" title="Events & Programs">
        <div className="-mt-6 mb-8">
          <p className="font-sans text-sm uppercase tracking-[0.15em] text-brand-600">
            ✦ Stay tuned for upcoming events and registrations
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center text-silver-400 py-12">
              Events will appear here soon. Check back regularly.
            </div>
          ) : (
            events.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="group flex flex-col overflow-hidden bg-ink-800 rounded-xl transition hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full bg-ink-700 overflow-hidden">
                  {e.imageUrl ? (
                    <Image
                      src={e.imageUrl}
                      alt={e.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center font-display text-7xl text-brand-600/30">N</div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {e.category && (
                      <span className="inline-block mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-brand-500 font-semibold">
                        {e.category}
                      </span>
                    )}
                    <h3 className="font-display text-xl uppercase text-silver-100 leading-tight">{e.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-silver-200 line-clamp-2">{e.summary}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="mt-10">
          <Link href="/events" className="btn-outline">All Events →</Link>
        </div>
      </Section>

      {/* 8 — CORE TEAM */}
      {team.length > 0 && (
        <Section eyebrow="The people behind it" title="Core Team" align="center" className="bg-ink-900 border-y border-ink-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((p) => (
              <div key={p.id} className="text-center">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-700 border border-ink-500 mb-4">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center font-display text-6xl text-brand-600/30">
                      {p.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-display text-xl uppercase tracking-wide text-silver-100">{p.name}</div>
                <div className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-brand-600">{p.role}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/team" className="btn-outline">Meet the Team →</Link>
          </div>
        </Section>
      )}

      {/* 9 — GALLERY */}
      <Section eyebrow="Inside the academy" title="Gallery">
        {gallery.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square border border-ink-500 bg-ink-800 grid place-items-center font-sans text-[11px] uppercase tracking-[0.2em] text-silver-600">
                Coming soon
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gallery.map((g) => (
              <div key={g.id} className="relative aspect-square overflow-hidden border border-ink-500 bg-ink-800">
                <Image
                  src={g.imageUrl}
                  alt={g.title ?? 'Norvex Sports gallery'}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/gallery" className="btn-outline">Explore Gallery →</Link>
        </div>
      </Section>

      {/* 10 — NEWS PREVIEW */}
      {news.length > 0 && (
        <Section eyebrow="News & updates" title="Latest from Norvex" className="bg-ink-900 border-y border-ink-500">
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.slug}`}
                className="group flex flex-col overflow-hidden bg-ink-800 rounded-xl transition hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full bg-ink-700 overflow-hidden">
                  {n.imageUrl ? (
                    <Image
                      src={n.imageUrl}
                      alt={n.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center font-display text-7xl text-brand-600/30">N</div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-brand-500 font-semibold">News</span>
                    <h3 className="font-display text-xl uppercase text-silver-100 leading-tight">{n.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-silver-200 line-clamp-2">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/news" className="btn-outline">All News →</Link>
          </div>
        </Section>
      )}

      {/* 11 — CONTACT CTA + FORM */}
      <Section id="enquire">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <span className="eyebrow">Start your journey</span>
            <h2 className="headline mt-3 text-4xl md:text-6xl text-silver-100 leading-[0.95]">
              Start Your Football<br />Journey Today
            </h2>
            <p className="mt-5 max-w-md text-silver-300">
              Book a free trial and meet the Norvex coaching team. No pressure — just football.
            </p>
            <ul className="mt-8 space-y-3 font-sans text-sm">
              <li className="flex items-center gap-3 text-silver-300">
                <span className="grid h-9 w-9 place-items-center border border-ink-500 bg-ink-800 text-brand-600"><MapPin className="h-4 w-4" /></span>
                {c.contact.location}
              </li>
              <li className="flex items-center gap-3 text-silver-300">
                <span className="grid h-9 w-9 place-items-center border border-ink-500 bg-ink-800 text-brand-600"><Phone className="h-4 w-4" /></span>
                <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="hover:text-silver-100">{c.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-silver-300">
                <span className="grid h-9 w-9 place-items-center border border-ink-500 bg-ink-800 text-brand-600"><Mail className="h-4 w-4" /></span>
                <a href={`mailto:${c.contact.email}`} className="hover:text-silver-100">{c.contact.email}</a>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${c.contact.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center bg-brand-600 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-silver-100 transition hover:brightness-110"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </a>
              <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="btn-outline">
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </a>
            </div>
          </div>
          <div className="border border-ink-500 bg-ink-800 p-6 md:p-8" id="trial">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl uppercase text-silver-100">Enquiry Form</h3>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 border border-brand-600/30 bg-brand-600/10 px-2 py-1">
                ✦ Free Trial
              </span>
            </div>
            <ContactForm />
          </div>
        </div>
      </Section>

      {/* 12 — CAREERS STRIP */}
      <section className="bg-brand-600">
        <div className="container-x py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-display text-2xl md:text-3xl uppercase tracking-wide text-silver-100">
              Careers at Norvex Sports
            </div>
            <div className="mt-1 font-sans text-sm text-silver-100/80">
              Passionate about football? Join our team — {c.contact.careersEmail}
            </div>
          </div>
          <Link
            href="/careers"
            className="inline-flex items-center bg-silver-100 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-brand-600 transition hover:bg-silver-100"
          >
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

const DEFAULT_SERVICE_PREVIEW = [
  { id: '1', slug: 'football-development-program', title: 'Football Development Program', shortDesc: 'Grassroots to elite — technical, tactical, physical, mental.' },
  { id: '2', slug: 'one-to-one-coaching', title: 'One-to-One Coaching', shortDesc: 'Personalised sessions tailored to your individual goals.' },
  { id: '3', slug: 'advanced-player-development', title: 'Advanced Player Development', shortDesc: 'For high-performance and competitive-level players.' },
  { id: '4', slug: 'adult-football-training', title: 'Adult Football Training', shortDesc: 'Fitness, skill development and structured match play.' },
  { id: '5', slug: 'tournament-organization', title: 'Tournament Organization', shortDesc: 'Professional event planning, execution and management.' },
  { id: '6', slug: 'school-college-programs', title: 'School & College Programs', shortDesc: 'Customized coaching for educational institutions.' },
];
