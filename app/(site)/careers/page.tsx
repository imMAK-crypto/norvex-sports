import type { Metadata } from 'next';
import { Mail, Heart, Zap, Target } from 'lucide-react';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Norvex Sports — passionate, dedicated, growth-driven individuals building a sports development environment.',
};

const TRAITS = [
  { Icon: Heart, t: 'Passionate', d: 'You live and breathe football and player development.' },
  { Icon: Zap, t: 'Dedicated', d: 'Consistency and discipline drive everything you do.' },
  { Icon: Target, t: 'Growth-Driven', d: 'You want to build something — not just clock hours.' },
];

export default async function CareersPage() {
  const c = await getSiteContent();
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build the game with us."
        intro="We're always looking for people who share the Norvex philosophy of dedication, discipline and professionalism."
      />

      <Section>
        <div className="mx-auto max-w-3xl prose-norvex">
          <p>
            At Norvex Sports, we are always looking for passionate, dedicated, and growth-driven individuals who
            want to be part of a dynamic sports development environment. As we continue to grow, we aim to build a
            strong team committed to professionalism, innovation, and player development both on and off the field.
          </p>
          <p>
            We welcome individuals who can understand, follow, and represent the Norvex philosophy and methodology
            with dedication, discipline, and professionalism.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl grid gap-4 sm:grid-cols-3">
          {TRAITS.map(({ Icon, t, d }) => (
            <div key={t} className="card-accent text-center">
              <div className="grid h-11 w-11 mx-auto place-items-center bg-brand-600/10 text-brand-600 mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg uppercase text-silver-100">{t}</h3>
              <p className="mt-1 text-sm text-silver-400">{d}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl border border-ink-500 bg-ink-800 p-8 text-center">
          <h3 className="font-display text-2xl uppercase text-silver-100">Interested in joining our team?</h3>
          <p className="mt-2 text-silver-300">Send your resume and portfolio to:</p>
          <a href={`mailto:${c.contact.careersEmail}`} className="btn-primary mt-6">
            <Mail className="mr-2 h-4 w-4" /> {c.contact.careersEmail}
          </a>
        </div>
      </Section>
    </>
  );
}
