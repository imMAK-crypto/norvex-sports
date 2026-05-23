import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [services, events, news, gallery, team, contacts, unread] = await Promise.all([
    prisma.service.count(),
    prisma.event.count(),
    prisma.newsPost.count(),
    prisma.galleryItem.count(),
    prisma.teamMember.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
  ]);

  const recentContacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const stats: Array<{ label: string; n: number; href: string }> = [
    { label: 'Services', n: services, href: '/admin/services' },
    { label: 'Events', n: events, href: '/admin/events' },
    { label: 'News posts', n: news, href: '/admin/news' },
    { label: 'Gallery items', n: gallery, href: '/admin/gallery' },
    { label: 'Team members', n: team, href: '/admin/team' },
    { label: 'Enquiries', n: contacts, href: '/admin/contacts' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-sm text-white/60 mt-1">
            {unread > 0 ? `${unread} unread enquiry${unread > 1 ? 'ies' : 'y'}` : 'All caught up.'}
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card hover:border-brand-500/50 transition">
            <p className="text-xs uppercase tracking-wider text-white/50">{s.label}</p>
            <p className="mt-2 font-display text-4xl text-brand-400">{s.n}</p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xl mb-4">Recent enquiries</h2>
        <div className="admin-card p-0 overflow-hidden">
          {recentContacts.length === 0 ? (
            <p className="p-6 text-sm text-white/50">No enquiries yet.</p>
          ) : (
            <ul>
              {recentContacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{c.name} <span className="text-white/40">· {c.phone}</span></p>
                    <p className="text-xs text-white/50">{c.program ?? 'General'} — {c.createdAt.toLocaleString('en-IN')}</p>
                  </div>
                  {!c.isRead && <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">new</span>}
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-white/10 p-3 text-right">
            <Link href="/admin/contacts" className="text-xs text-brand-400 hover:underline">View all →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
