import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Norvex Sports — passionate, dedicated, growth-driven individuals building a sports development environment.',
};

export default async function CareersPage() {
  const c = await getSiteContent();
  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Careers</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Build the game with us.</h1>
        </div>
      </header>

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
          <div className="card mt-8 not-prose">
            <h3 className="font-display text-2xl text-brand-400">Interested in joining our team?</h3>
            <p className="mt-2 text-white/80">Send your resume and portfolio to:</p>
            <a href={`mailto:${c.contact.careersEmail}`} className="btn-primary mt-4">
              {c.contact.careersEmail}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
