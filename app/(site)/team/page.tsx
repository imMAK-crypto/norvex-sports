import type { Metadata } from 'next';
import Image from 'next/image';
import { prisma, safeQuery, type TeamMemberModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Core Team',
  description: 'Meet the Norvex Sports founding team — coaches and operators building football in Hyderabad.',
};

export const revalidate = 60;

export default async function TeamPage() {
  const team = await safeQuery<TeamMemberModel[]>(
    () => prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Core team"
        title="The people behind Norvex."
        intro="Co-founders, coaches and operators building a structured football pathway from Hyderabad outward."
      />

      <Section>
        {team.length === 0 ? (
          <p className="text-center text-silver-400">Team profiles coming soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((m) => (
              <article key={m.id} className="border border-ink-500 bg-ink-800 overflow-hidden">
                <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[3/4] bg-ink-700">
                    {m.imageUrl ? (
                      <Image src={m.imageUrl} alt={m.name} fill sizes="180px" className="object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-display text-5xl text-brand-600/40">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col">
                    <h3 className="font-display text-2xl uppercase text-silver-100 tracking-wide">{m.name}</h3>
                    <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{m.role}</p>
                    {m.bio && <p className="mt-3 text-sm text-silver-300 line-clamp-4">{m.bio}</p>}
                    <dl className="mt-auto pt-4 space-y-1 text-xs">
                      {m.qualifications && (
                        <div className="flex gap-2">
                          <dt className="text-silver-500 uppercase tracking-wider">Qualifications:</dt>
                          <dd className="text-silver-300">{m.qualifications}</dd>
                        </div>
                      )}
                      {m.experience && (
                        <div className="flex gap-2">
                          <dt className="text-silver-500 uppercase tracking-wider">Experience:</dt>
                          <dd className="text-silver-300">{m.experience}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
