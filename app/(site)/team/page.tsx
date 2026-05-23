import type { Metadata } from 'next';
import { prisma, safeQuery, type TeamMemberModel } from '@/lib/prisma';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Our Team',
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
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Our team</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">The Norvex coaching team.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Co-founders, coaches and operators building a structured football pathway from Hyderabad outward.
          </p>
        </div>
      </header>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {team.map((m) => (
            <article key={m.id} className="card flex gap-6">
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600/40 to-ink-800 grid place-items-center">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-4xl text-brand-400">{m.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl text-white">{m.name}</h3>
                <p className="text-sm text-brand-400">{m.role}</p>
                {m.bio && <p className="mt-3 text-sm text-white/70">{m.bio}</p>}
                {(m.qualifications || m.experience) && (
                  <div className="mt-3 text-xs text-white/50 space-y-1">
                    {m.qualifications && <p><span className="text-white/70">Qualifications:</span> {m.qualifications}</p>}
                    {m.experience && <p><span className="text-white/70">Experience:</span> {m.experience}</p>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
