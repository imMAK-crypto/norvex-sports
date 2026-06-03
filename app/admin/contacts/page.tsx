import { prisma } from '@/lib/prisma';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteContact, markRead } from './actions';

export default async function ContactsAdminPage() {
  const items = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Enquiries</h1>
        <p className="text-sm text-silver-100/60 mt-1">All form submissions from the website.</p>
      </header>

      <div className="admin-card p-0 overflow-x-auto">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-silver-100/50">No enquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-silver-100/40">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className={`border-t border-white/5 ${!c.isRead ? 'bg-brand-500/5' : ''}`}>
                  <td className="px-4 py-3 text-xs text-silver-100/60 whitespace-nowrap">{c.createdAt.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium">
                    {c.name} {c.age && <span className="text-silver-100/40">({c.age})</span>}
                  </td>
                  <td className="px-4 py-3"><a href={`tel:${c.phone}`} className="text-brand-400 hover:underline">{c.phone}</a></td>
                  <td className="px-4 py-3 text-silver-100/70">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-silver-100/70">{c.program ?? '—'}</td>
                  <td className="px-4 py-3 max-w-sm text-silver-100/70">{c.message ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {!c.isRead && (
                        <form action={markRead}>
                          <input type="hidden" name="id" value={c.id} />
                          <button type="submit" className="text-xs text-silver-100/70 hover:text-brand-400">Mark read</button>
                        </form>
                      )}
                      <form action={deleteContact}>
                        <input type="hidden" name="id" value={c.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
