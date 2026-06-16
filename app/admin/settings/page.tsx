import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/prisma';
import { cloudinaryConfigured } from '@/lib/cloudinary';
import { siteUrl } from '@/lib/settings';
import { PageHead, Panel, PanelTitle } from '../_components/ui';
import { PasswordForm } from './PasswordForm';

export const dynamic = 'force-dynamic';

const fmtDate = (d: Date) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid #1e2125' }}>
      <span style={{ fontSize: 12, color: 'var(--t4)' }}>{label}</span>
      <span className={mono ? 'mono' : undefined} style={{ fontSize: 13, color: 'var(--t2)', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export default async function SettingsPage() {
  const session = await getSession();
  const account = session
    ? await safeQuery(() => prisma.adminUser.findUnique({ where: { id: session.sub } }), null)
    : null;

  const name = account?.name || 'Admin';
  const initial = (name || account?.email || 'A').charAt(0).toUpperCase();
  const env = process.env.NODE_ENV;
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1180 }}>
      <PageHead
        crumb="SYSTEM / SETTINGS"
        title="Settings"
        subtitle="Your account, security, uploads and site configuration."
        actions={<Link href="/" target="_blank" className="cms-btn cms-btn-ghost">View site ↗</Link>}
      />

      <div className="cms-grid-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18 }}>
        {/* Account */}
        <Panel i={0}>
          <PanelTitle>Account</PanelTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 6 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid #3a3f45', background: '#1f2226', display: 'grid', placeItems: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 22, flex: 'none' }}>
              {initial}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>{name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{account?.role ?? 'owner'}</div>
            </div>
          </div>
          <div>
            <Row label="Username" value={account?.username ?? '—'} mono />
            <Row label="Email" value={account?.email ?? session?.email ?? '—'} mono />
            <Row label="Role" value={account?.role ?? 'owner'} />
            <Row label="Member since" value={account ? fmtDate(account.createdAt) : '—'} />
          </div>
        </Panel>

        {/* Security */}
        <Panel i={1}>
          <span id="password" style={{ position: 'relative', top: -90 }} />
          <PanelTitle hint="bcrypt · 12 rounds">Change password</PanelTitle>
          <PasswordForm />
          <p className="mono" style={{ fontSize: 11, color: 'var(--t5)', marginTop: 4 }}>
            Sessions are signed JWTs (HS256) stored in an http-only cookie and expire after 7 days. Logins are rate-limited.
          </p>
        </Panel>

        {/* Image uploads */}
        <Panel i={2}>
          <PanelTitle>Image uploads</PanelTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: cloudinaryConfigured ? '#7fb98a' : 'var(--accent)' }} />
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>
              {cloudinaryConfigured ? 'Cloudinary connected — direct uploads enabled.' : 'Cloudinary not configured.'}
            </span>
          </div>
          {cloudinaryConfigured ? (
            <Row label="Cloud name" value={cloud ?? '—'} mono />
          ) : (
            <p style={{ fontSize: 12, color: 'var(--t4)' }}>
              Set <span className="mono" style={{ color: 'var(--t2)' }}>CLOUDINARY_CLOUD_NAME</span>,{' '}
              <span className="mono" style={{ color: 'var(--t2)' }}>CLOUDINARY_API_KEY</span> and{' '}
              <span className="mono" style={{ color: 'var(--t2)' }}>CLOUDINARY_API_SECRET</span> to enable uploads.
              Until then, paste image URLs directly.
            </p>
          )}
          <Link href="/admin/media" className="cms-btn cms-btn-ghost" style={{ alignSelf: 'flex-start', height: 34 }}>Open Media Library →</Link>
        </Panel>

        {/* Site */}
        <Panel i={3}>
          <PanelTitle>Site</PanelTitle>
          <Row label="Public URL" value={<a href={siteUrl()} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{siteUrl().replace(/^https?:\/\//, '')}</a>} mono />
          <Row label="Environment" value={env} mono />
          <Row label="Platform" value="Next.js · Vercel" />
          <Row label="Database" value="PostgreSQL (Neon)" />
        </Panel>
      </div>

      {/* Quick links */}
      <Panel i={4}>
        <PanelTitle>Manage content</PanelTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {[
            { label: 'Site content', href: '/admin/content', hint: 'About · contact · social' },
            { label: 'Page editors', href: '/admin/pages/home', hint: 'Home · about · careers…' },
            { label: 'Media library', href: '/admin/media', hint: 'Uploads & assets' },
            { label: 'Enquiries', href: '/admin/contacts', hint: 'Leads & messages' },
          ].map((q) => (
            <Link key={q.href} href={q.href} className="cms-lift" style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 14px', border: '1px solid var(--line-2)', borderRadius: 10, textDecoration: 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600 }}>{q.label} →</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>{q.hint}</span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
