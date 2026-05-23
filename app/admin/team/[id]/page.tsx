import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { TeamForm } from '../TeamForm';
import { updateTeam } from '../actions';

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const m = await prisma.teamMember.findUnique({ where: { id: params.id } });
  if (!m) notFound();
  const action = updateTeam.bind(null, m.id);
  return (
    <AdminFormShell title={`Edit · ${m.name}`}>
      <TeamForm action={action} initial={m} />
    </AdminFormShell>
  );
}
