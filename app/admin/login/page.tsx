import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Admin Sign In', robots: { index: false, follow: false } };

export default function AdminLogin({ searchParams }: { searchParams?: { next?: string; error?: string } }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: 'radial-gradient(120% 80% at 50% -10%, rgba(226,59,64,0.07), transparent 60%)',
      }}
    >
      <div className="cms-pop cms-panel" style={{ width: 380, maxWidth: '100%', padding: 32, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: 18, borderColor: 'var(--line-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #3a3f45', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 20 }}>
            N
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 15 }}>Norvex Sports</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>Content Admin</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--t1)' }}>Sign in</span>
          <span style={{ fontSize: 13, color: 'var(--t4)' }}>Manage every page, image &amp; enquiry.</span>
        </div>
        <LoginForm next={searchParams?.next} initialError={searchParams?.error} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--t5)', textAlign: 'center' }}>JWT session · bcrypt · rate-limited</span>
      </div>
    </main>
  );
}
