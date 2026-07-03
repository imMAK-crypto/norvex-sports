import type { Metadata } from 'next';
import { prisma, safeQuery, type TeamMemberModel } from '@/lib/prisma';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, teamListLd, webPageLd } from '@/lib/seo';
import { TeamGrid } from '@/components/TeamGrid';

export const metadata: Metadata = pageMeta({
  title: 'Core Team',
  description: 'Meet the Norvex Sports founding team — coaches and operators building football in Hyderabad.',
  path: '/team',
});

export const revalidate = 60;

export default async function TeamPage() {
  const team = await safeQuery<TeamMemberModel[]>(
    () => prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    [],
  );

  return (
    <>
      <JsonLd
        data={
          team.length > 0
            ? [
                webPageLd({
                  path: '/team',
                  type: 'ProfilePage',
                  name: 'Core Team — Norvex Sports',
                  description:
                    'Meet the Norvex Sports founding team — coaches and operators building football in Hyderabad.',
                }),
                teamListLd(team),
              ]
            : webPageLd({
                path: '/team',
                type: 'ProfilePage',
                name: 'Core Team — Norvex Sports',
                description: 'Meet the Norvex Sports founding team.',
              })
        }
      />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Team', path: '/team' }]} />
      <PageHeader
        eyebrow="Core team"
        title="The people behind Norvex."
        intro="Co-founders, coaches and operators building a structured football pathway from Hyderabad outward."
      />

      <Section>
        {team.length === 0 ? (
          <p className="text-center text-silver-400">Team profiles coming soon.</p>
        ) : (
          <TeamGrid
            members={team.map((m) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              bio: m.bio,
              imageUrl: m.imageUrl,
            }))}
          />
        )}
      </Section>
    </>
  );
}
