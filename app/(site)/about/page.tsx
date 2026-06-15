import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Activity, Award, Users, Heart } from 'lucide-react';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'About Norvex Sports',
  description:
    'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform — grassroots to elite, technical, physical and mental.',
};

export const revalidate = 300;

const VALUES = [
  { Icon: Shield, t: 'Discipline & Consistency', d: 'Consistent effort and discipline are the foundation of every player\'s growth.' },
  { Icon: Activity, t: 'Prioritizing Athlete Development', d: 'Every decision is focused on the long-term development and progress of our athletes.' },
  { Icon: Award, t: 'Professionalism & Integrity', d: 'High standards in coaching, conduct, and commitment at every level.' },
  { Icon: Users, t: 'Teamwork & Respect', d: 'A positive environment where players respect teammates, coaches, and the game.' },
  { Icon: Heart, t: 'Sports for Everyone', d: 'Equal opportunity to participate and grow — regardless of background, skill, or ability.' },
];

export default async function AboutPage() {
  const c = await getSiteContent();
  const paragraphs = c.aboutLong.split(/\n\s*\n/);

  return (
    <>
      <PageHeader eyebrow="About us" title="Built for the football journey." intro="Founded in 2026 in Hyderabad — structured training, expert coaching, and a culture built on discipline." />

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
                src="/images/about_page.webp"
                alt="Norvex training"
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ Icon, t, d }) => (
            <div key={t} className="card-accent">
              <div className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-silver-100">{t}</h3>
              <p className="mt-2 text-sm text-silver-300">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
