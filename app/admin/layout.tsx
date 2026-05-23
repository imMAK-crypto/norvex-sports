import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminSidebar } from './_components/AdminSidebar';

export const metadata: Metadata = {
  title: { default: 'Admin · Norvex', template: '%s · Norvex Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-4 lg:px-8">
              <Link href="/admin" className="font-display text-lg">Norvex Admin</Link>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className="text-xs text-white/60 hover:text-white">Sign out</button>
              </form>
            </div>
          </header>
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
