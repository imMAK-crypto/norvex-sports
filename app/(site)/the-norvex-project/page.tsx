import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Activity, Award, Users, Heart } from 'lucide-react';
import { getSiteContent, getSettings } from '@/lib/settings';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'The Norvex Project — Our Vision',
  description:
    'The Norvex Project — building a structured, professional sports development platform from grassroots to elite across multiple sports and cities.',
};

export const revalidate = 300;

const VALUES = [
  {
    Icon: Shield,
    t: 'Discipline & Consistency',
    d: 'We believe consistent effort and discipline are the foundation of every player\'s growth.',
  },
  {
    Icon: Activity,
    t: 'Prioritizing Athlete Development',
    d: 'Every decision we make is focused on the long-term development and progress of our athletes.',
  },
  {
    Icon: Award,
    t: 'Professionalism & Integrity',
    d: 'We maintain high standards in coaching, conduct, and commitment at all levels.',
  },
  {
    Icon: Users,
    t: 'Teamwork & Respect',
    d: 'We promote a positive environment where players learn to respect teammates, coaches, and the game.',
  },
  {
    Icon: Heart,
    t: 'Sports for Everyone',
    d: 'Sports for Everyone means creating an environment where everyone feels welcomed, valued, and given equal opportunities to participate and grow in sports — regardless of their background, gender, skill level, language, religion, or physical ability.',
  },
];

export default async function NorvexProjectPage() {
  const [c, s] = await Promise.all([
    getSiteContent(),
    getSettings(['norvex.eyebrow', 'norvex.title', 'norvex.intro']),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={s['norvex.eyebrow']}
        title={s['norvex.title']}
        intro={s['norvex.intro']}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="prose-norvex text-lg">
            <p>{c.projectStatement}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { n: '01', t: 'Grassroots to Elite', d: 'A clear pathway for every age and ability.' },
              { n: '02', t: 'Multi-Sport Vision', d: 'Football today — more sports tomorrow.' },
              { n: '03', t: 'Multi-City Expansion', d: 'Hyderabad first. India next.' },
            ].map((s) => (
              <div key={s.n} className="card-accent">
                <div className="font-display text-3xl text-brand-600">{s.n}</div>
                <div className="mt-2 font-display text-lg uppercase tracking-wide text-silver-100">{s.t}</div>
                <p className="mt-2 text-sm text-silver-200">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* OUR VALUES */}
      <Section
        eyebrow="What we stand for"
        title="Our Values"
        align="center"
        className="bg-ink-900 border-y border-ink-500"
        intro="At Norvex Sports, our values shape everything we do — on and off the field. We are committed to building not just better players, but disciplined and confident individuals."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ Icon, t, d }) => (
            <div key={t} className="card-accent">
              <div className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600 mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-silver-100">{t}</h3>
              <p className="mt-2 text-sm text-silver-200">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/contact#trial" className="btn-primary">
            Be Part of the Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
