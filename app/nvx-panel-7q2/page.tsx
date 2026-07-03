import Link from 'next/link';
import { prisma, safeQuery } from '@/lib/prisma';
import { PageHead, Panel, EmptyState } from './_components/ui';

export const dynamic = 'force-dynamic';

const fmtDate = (d: Date) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export default async function AdminDashboard() {
  const [services, events, news, gallery, team, enquiries, unread, media, jobs] = await Promise.all([
    safeQuery(() => prisma.service.count(), 0),
    safeQuery(() => prisma.event.count(), 0),
    safeQuery(() => prisma.newsPost.count(), 0),
    safeQuery(() => prisma.galleryItem.count(), 0),
    safeQuery(() => prisma.teamMember.count(), 0),
    safeQuery(() => prisma.contactSubmission.count(), 0),
    safeQuery(() => prisma.contactSubmission.count({ where: { isRead: false } }), 0),
    safeQuery(() => prisma.mediaAsset.count(), 0),
    safeQuery(() => prisma.jobPosting.count(), 0),
  ]);

  const [recentEnq, recentMedia] = await Promise.all([
    safeQuery(() => prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }), []),
    safeQuery(() => prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }), []),
  ]);

  const stats: Array<{ label: string; num: number; href: string; badge?: number }> = [
    { label: 'Services', num: services, href: '/nvx-panel-7q2/services' },
    { label: 'Events', num: events, href: '/nvx-panel-7q2/events' },
    { label: 'News Posts', num: news, href: '/nvx-panel-7q2/news' },
    { label: 'Gallery Items', num: gallery, href: '/nvx-panel-7q2/gallery' },
    { label: 'Team Members', num: team, href: '/nvx-panel-7q2/team' },
    { label: 'Enquiries', num: enquiries, href: '/nvx-panel-7q2/contacts', badge: unread },
    { label: 'Media Assets', num: media, href: '/nvx-panel-7q2/media' },
    { label: 'Job Postings', num: jobs, href: '/nvx-panel-7q2/pages/careers' },
  ];

  const quickActions = [
    { label: 'Edit Home hero image', href: '/nvx-panel-7q2/pages/home' },
    { label: 'Add new Event', href: '/nvx-panel-7q2/events/new' },
    { label: 'Upload to Gallery', href: '/nvx-panel-7q2/gallery' },
    { label: 'Write News post', href: '/nvx-panel-7q2/news/new' },
    { label: 'Open Media Library', href: '/nvx-panel-7q2/media' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1180 }}>
      <PageHead
        crumb="OVERVIEW / DASHBOARD"
        title="Dashboard"
        subtitle="Content overview for norvexsports.in"
        actions={<Link href="/nvx-panel-7q2/events/new" className="cms-btn cms-btn-primary">+ Quick add</Link>}
      />

      {/* stat cards */}
      <div className="cms-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className="cms-panel cms-lift"
            style={{ ['--i' as string]: i, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9, textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{s.label}</span>
              <span style={{ width: 22, height: 22, border: '1px solid #3a3f45', borderRadius: 6 }} />
            </div>
            <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--t1)', lineHeight: 1 }}>{s.num}</span>
            {s.badge ? (
              <span className="cms-badge" style={{ alignSelf: 'flex-start' }}>{s.badge} new</span>
            ) : (
              <span style={{ height: 18 }} />
            )}
          </Link>
        ))}
      </div>

      {/* recent enquiries + quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 18 }} className="cms-grid-collapse">
        <Panel i={0} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--line)' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Recent enquiries</span>
            <Link href="/nvx-panel-7q2/contacts" style={{ fontSize: 12, color: 'var(--accent)' }}>View all →</Link>
          </div>
          {recentEnq.length === 0 ? (
            <EmptyState>No enquiries yet.</EmptyState>
          ) : (
            recentEnq.map((e) => (
              <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', gap: 12, alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid #1e2125' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.isRead ? '#3a3f45' : 'var(--accent)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--t2)' }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.program ?? 'General'}</div>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t5)', textAlign: 'right' }}>{fmtDate(e.createdAt)}</span>
              </div>
            ))
          )}
        </Panel>

        <Panel i={1}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Quick actions</span>
          {quickActions.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="cms-lift"
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid var(--line-2)', borderRadius: 9, fontSize: 13, color: 'var(--t2)', textDecoration: 'none' }}
            >
              <span className="mono" style={{ width: 22, height: 22, border: '1px solid #3a3f45', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t4)', fontSize: 11 }}>+</span>
              <span style={{ flex: 1 }}>{q.label}</span>
              <span style={{ color: 'var(--t5)' }}>→</span>
            </Link>
          ))}
        </Panel>
      </div>

      {/* recent media */}
      <Panel i={2}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Recent media uploads</span>
          <Link href="/nvx-panel-7q2/media" style={{ fontSize: 12, color: 'var(--accent)' }}>Media library →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {(recentMedia.length ? recentMedia : Array.from({ length: 6 }).map(() => null)).map((m, i) =>
            m ? (
              <Link key={m.id} href="/nvx-panel-7q2/media" className="cms-lift" style={{ height: 78, borderRadius: 9, border: '1px solid var(--line-2)', overflow: 'hidden', display: 'block', background: '#000' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
            ) : (
              <div key={i} style={{ height: 78, borderRadius: 9, border: '1px solid var(--line-2)', background: 'repeating-linear-gradient(45deg,rgba(255,255,255,.015) 0 9px,rgba(255,255,255,.04) 9px 18px)', display: 'flex', alignItems: 'flex-end', padding: 7 }}>
                <span className="mono" style={{ fontSize: 9, color: 'var(--t5)' }}>empty</span>
              </div>
            ),
          )}
        </div>
      </Panel>
    </div>
  );
}
