import type { Metadata } from 'next';
import { Mail, Heart, Zap, Target, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { prisma, safeQuery } from '@/lib/prisma';
import { getSiteContent, getSettings } from '@/lib/settings';
import { pageMeta, jobPostingLd, webPageLd } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { EmailLink } from '@/components/EmailLink';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMeta({
  title: 'Careers',
  description: 'Join Norvex Sports — passionate, dedicated, growth-driven individuals building a sports development environment.',
  path: '/careers',
});

const TRAITS = [
  { Icon: Heart, t: 'Passionate', d: 'You live and breathe football and player development.' },
  { Icon: Zap, t: 'Dedicated', d: 'Consistency and discipline drive everything you do.' },
  { Icon: Target, t: 'Growth-Driven', d: 'You want to build something — not just clock hours.' },
];

export default async function CareersPage() {
  const [c, s, jobs] = await Promise.all([
    getSiteContent(),
    getSettings(['careers.eyebrow', 'careers.title', 'careers.intro', 'careers.body']),
    safeQuery(
      () => prisma.jobPosting.findMany({ where: { isOpen: true }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
      [],
    ),
  ]);

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: '/careers',
            type: 'CollectionPage',
            name: 'Careers — Norvex Sports',
            description:
              'Join Norvex Sports — passionate, dedicated, growth-driven people building a sports development environment in Hyderabad.',
          }),
          ...jobs.map((job) => jobPostingLd(job)),
        ]}
      />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }]} />
      <PageHeader eyebrow={s['careers.eyebrow']} title={s['careers.title']} intro={s['careers.intro']} />

      <Section>
        <div className="mx-auto max-w-3xl prose-norvex">
          <p>{s['careers.body']}</p>
          <p>
            We welcome individuals who can understand, follow, and represent the Norvex philosophy and methodology
            with dedication, discipline, and professionalism.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl grid gap-4 sm:grid-cols-3">
          {TRAITS.map(({ Icon, t, d }) => (
            <div key={t} className="card-accent text-center">
              <div className="grid h-11 w-11 mx-auto place-items-center rounded-lg bg-brand-600/10 text-brand-600 mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg uppercase text-silver-100">{t}</h3>
              <p className="mt-1 text-sm text-silver-400">{d}</p>
            </div>
          ))}
        </div>

        {jobs.length > 0 && (
          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="font-display text-3xl uppercase tracking-wide text-silver-100 text-center">Open Positions</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <div key={job.id} className="flex flex-col rounded-xl border border-ink-500 bg-ink-800 p-6 transition hover:border-brand-600">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl uppercase text-silver-100">{job.title}</h3>
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand-600/10 text-brand-600"><Briefcase className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 font-sans text-[11px] uppercase tracking-[0.15em] text-silver-400">
                    {job.type && <span className="inline-flex items-center rounded-md border border-ink-500 px-2 py-1">{job.type}</span>}
                    {job.location && <span className="inline-flex items-center gap-1 rounded-md border border-ink-500 px-2 py-1"><MapPin className="h-3 w-3" /> {job.location}</span>}
                  </div>
                  {job.description && <p className="mt-3 text-sm text-silver-300">{job.description}</p>}
                  {job.applyUrl ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-auto pt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 hover:text-brand-500"
                    >
                      Apply Now <ArrowRight className="h-3 w-3" />
                    </a>
                  ) : (
                    <EmailLink
                      email={c.contact.careersEmail}
                      subject={`Application: ${job.title}`}
                      className="mt-auto pt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 hover:text-brand-500"
                    >
                      Apply Now <ArrowRight className="h-3 w-3" />
                    </EmailLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-ink-500 bg-ink-800 p-8 text-center">
          <h3 className="font-display text-2xl uppercase text-silver-100">Interested in joining our team?</h3>
          <p className="mt-2 text-silver-300">Send your resume and portfolio to:</p>
          <EmailLink email={c.contact.careersEmail} className="btn-primary mt-6">
            <Mail className="mr-2 h-4 w-4" /> {c.contact.careersEmail}
          </EmailLink>
        </div>
      </Section>
    </>
  );
}
