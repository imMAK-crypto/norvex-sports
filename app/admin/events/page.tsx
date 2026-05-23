import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteEvent } from './actions';

export default async function EventsAdminPage() {
  const events = await prisma.event.findMany({ orderBy: [{ isFeatured: 'desc' }, { date: 'desc' }] });
  return (
    <AdminListShell title="Events" newHref="/admin/events/new" newLabel="New event">
      {events.length === 0 ? (
        <p className="p-6 text-sm text-white/50">No events yet.</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {e.title}
                  {e.isFeatured && <span className="ml-2 rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] text-brand-300">FEATURED</span>}
                  {!e.isActive && <span className="ml-2 text-xs text-white/40">(hidden)</span>}
                </p>
                <p className="text-xs text-white/50 truncate">
                  /events/{e.slug} · {e.category ?? 'Uncategorised'} · {e.date ? new Date(e.date).toLocaleDateString() : 'no date'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/events/${e.id}`} className="text-xs text-brand-400 hover:underline">Edit</Link>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
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
