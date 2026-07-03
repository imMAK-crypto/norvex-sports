import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteVenue } from './actions';

export default async function VenuesAdminPage() {
  const venues = await prisma.venue.findMany({
    orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
  });
  return (
    <AdminListShell title="Venues" newHref="/nvx-panel-7q2/venues/new" newLabel="Add venue">
      {venues.length === 0 ? (
        <p className="p-6 text-sm text-silver-100/50">No venues yet. Add your main academy and any extra training grounds.</p>
      ) : (
        <ul>
          {venues.map((v) => (
            <li key={v.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 flex-shrink-0 grid place-items-center rounded-full bg-brand-700/30 text-brand-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {v.name}
                    {v.isPrimary && <span className="ml-2 text-[10px] uppercase tracking-wider text-brand-400">Main</span>}
                    {!v.isActive && <span className="ml-2 text-xs text-silver-100/40">(hidden)</span>}
                  </p>
                  <p className="text-xs text-silver-100/50 truncate">{v.address ?? v.mapUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/nvx-panel-7q2/venues/${v.id}`} className="text-xs text-brand-400 hover:underline">Edit</Link>
                <form action={deleteVenue}>
                  <input type="hidden" name="id" value={v.id} />
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
