import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteTeam } from './actions';

export default async function TeamAdminPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  return (
    <AdminListShell title="Team" newHref="/admin/team/new" newLabel="Add member">
      {team.length === 0 ? (
        <p className="p-6 text-sm text-silver-100/50">No team members yet.</p>
      ) : (
        <ul>
          {team.map((m) => (
            <li key={m.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-brand-700/30 grid place-items-center text-sm">
                  {m.imageUrl ? <img src={m.imageUrl} alt="" className="h-full w-full object-cover" /> : m.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.name} {!m.isActive && <span className="text-xs text-silver-100/40">(hidden)</span>}</p>
                  <p className="text-xs text-silver-100/50 truncate">{m.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/team/${m.id}`} className="text-xs text-brand-400 hover:underline">Edit</Link>
                <form action={deleteTeam}>
                  <input type="hidden" name="id" value={m.id} />
                  <DeleteButton />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminListShell>
  );
}
