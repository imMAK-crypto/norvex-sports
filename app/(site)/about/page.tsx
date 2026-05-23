import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'About Norvex Sports',
  description:
    'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform — grassroots to elite, technical, physical and mental.',
};

export const revalidate = 300;

export default async function AboutPage() {
  const c = await getSiteContent();
  const paragraphs = c.aboutLong.split(/\n\s*\n/);
  const values = [
    { t: 'Discipline & Consistency', d: 'Consistent effort and discipline are the foundation of every player\'s growth.' },
    { t: 'Athlete Development First', d: 'Every decision is focused on the long-term development and progress of our athletes.' },
    { t: 'Professionalism & Integrity', d: 'High standards in coaching, conduct, and commitment at all levels.' },
    { t: 'Teamwork & Respect', d: 'A positive environment where players respect teammates, coaches, and the game.' },
    { t: 'Sports for Everyone', d: 'Equal opportunity to participate and grow — regardless of background, gender, skill level, language, religion, or physical ability.' },
  ];

  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">About us</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Built for the football journey.</h1>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 prose-norvex">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="card h-fit">
            <h3 className="font-display text-2xl text-brand-400">The Norvex Project</h3>
            <p className="mt-3 text-sm text-white/70">{c.projectStatement}</p>
          </aside>
        </div>
      </Section>

      <Section eyebrow="What we stand for" title="Our values." className="bg-white/[0.02]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="card">
              <h3 className="font-display text-xl text-white">{v.t}</h3>
              <p className="mt-2 text-sm text-white/70">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
