import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteService } from './actions';

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return (
    <AdminListShell title="Services" newHref="/admin/services/new" newLabel="New service">
      {services.length === 0 ? (
        <p className="p-6 text-sm text-silver-100/50">No services yet.</p>
      ) : (
        <ul>
          {services.map((s) => (
            <li key={s.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="font-medium truncate">{s.title} {!s.isActive && <span className="text-xs text-silver-100/40">(hidden)</span>}</p>
                <p className="text-xs text-silver-100/50 truncate">/services/{s.slug}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/services/${s.id}`} className="text-xs text-brand-400 hover:underline">Edit</Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
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
