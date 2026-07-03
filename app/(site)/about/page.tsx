import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Activity, Award, Users, Heart, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { getSiteContent, getSettings } from '@/lib/settings';
import { pageMeta, webPageLd, ORG_KEYWORDS } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { ThreadsIcon, XIcon } from '@/components/SocialIcons';
import { centerGridClass, centerCardSpan, centerLastRow } from '@/lib/grid';

export const metadata: Metadata = pageMeta({
  title: 'About Norvex Sports',
  description:
    'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform — grassroots to elite, technical, physical and mental.',
  path: '/about',
  keywords: ['about Norvex Sports', 'football academy Hyderabad', ...ORG_KEYWORDS.slice(0, 8)],
});

export const revalidate = 300;

const VALUES = [
  { Icon: Shield, t: 'Discipline & Consistency', d: 'Consistent effort and discipline are the foundation of every player\'s growth.' },
  { Icon: Activity, t: 'Prioritizing Athlete Development', d: 'Every decision is focused on the long-term development and progress of our athletes.' },
  { Icon: Award, t: 'Professionalism & Integrity', d: 'High standards in coaching, conduct, and commitment at every level.' },
  { Icon: Users, t: 'Teamwork & Respect', d: 'A positive environment where players respect teammates, coaches, and the game.' },
  { Icon: Heart, t: 'Sports for Everyone', d: 'Equal opportunity to participate and grow — regardless of background, skill, or ability.' },
];

export default async function AboutPage() {
  const [c, s] = await Promise.all([
    getSiteContent(),
    getSettings(['about.eyebrow', 'about.title', 'about.intro', 'about.image']),
  ]);
  const paragraphs = c.aboutLong.split(/\n\s*\n/);

  const socials = [
    { href: c.social.instagram, label: 'Instagram', handle: '@norvexsports', Icon: Instagram },
    { href: c.social.threads, label: 'Threads', handle: '@norvexsports', Icon: ThreadsIcon },
    { href: c.social.x, label: 'X', handle: '@NORVEXSPORTS', Icon: XIcon },
    { href: c.social.facebook, label: 'Facebook', handle: 'Norvex Sports', Icon: Facebook },
    { href: c.social.linkedin, label: 'LinkedIn', handle: 'Norvex Sports', Icon: Linkedin },
    ...(c.social.youtube ? [{ href: c.social.youtube, label: 'YouTube', handle: 'Norvex Sports', Icon: Youtube }] : []),
  ].filter((item) => item.href);

  return (
    <>
      <JsonLd
        data={webPageLd({
          path: '/about',
          type: 'AboutPage',
          name: 'About Norvex Sports',
          description: c.aboutShort,
          image: s['about.image'],
        })}
      />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <PageHeader eyebrow={s['about.eyebrow']} title={s['about.title']} intro={s['about.intro']} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-norvex">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <Link href="/the-norvex-project" className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 hover:text-brand-500 no-underline">
              The Norvex Project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <aside className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ink-500">
              <Image
                src={s['about.image']}
                alt={s['about.title']}
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="card-accent">
              <h3 className="font-display text-xl uppercase text-silver-100">The Norvex Project</h3>
              <p className="mt-3 text-sm text-silver-300">{c.projectStatement}</p>
            </div>
          </aside>
        </div>
      </Section>

      <Section eyebrow="What we stand for" title="Our Values" align="center" className="bg-ink-900 border-y border-ink-500">
        <div className={`grid gap-5 md:grid-cols-2 ${centerGridClass('lg')}`}>
          {VALUES.map(({ Icon, t, d }, i) => (
            <div key={t} className={`card-accent ${centerCardSpan('lg')} ${centerLastRow('lg', i, VALUES.length)}`}>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600/10 text-brand-600 mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-silver-100">{t}</h3>
              <p className="mt-2 text-sm text-silver-300">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONNECT / SOCIAL */}
      <Section
        eyebrow="Connect with us"
        title="Follow Norvex Sports"
        align="center"
        intro="Training highlights, match moments, player milestones and event announcements — follow along on every platform."
      >
        <div className={`grid gap-4 sm:grid-cols-2 ${centerGridClass('lg')}`}>
          {socials.map(({ href, label, handle, Icon }, i) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className={`flex items-center gap-4 rounded-xl border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600 ${centerCardSpan('lg')} ${centerLastRow('lg', i, socials.length)}`}
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-lg bg-brand-600/10 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-left">
                  <span className="block font-display text-lg uppercase tracking-wide text-silver-100">{label}</span>
                  <span className="block font-sans text-sm text-silver-400">{handle}</span>
                </span>
              </a>
            ))}
        </div>
      </Section>
    </>
  );
}
