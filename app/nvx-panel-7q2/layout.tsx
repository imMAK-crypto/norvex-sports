import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/lib/prisma';
import { AdminShell } from './_components/AdminShell';

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});
const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Admin · Norvex', template: '%s · Norvex Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login screen (and any unauthenticated state) renders bare inside the CMS theme.
  if (!session) {
    return (
      <div className={`cms ${grotesk.variable} ${mono.variable}`} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    );
  }

  const [unread, account] = await Promise.all([
    safeQuery(() => prisma.contactSubmission.count({ where: { isRead: false } }), 0),
    safeQuery(() => prisma.adminUser.findUnique({ where: { id: session.sub } }), null),
  ]);

  const user = {
    email: account?.email ?? session.email,
    name: account?.name || 'Admin',
    role: account?.role ?? 'owner',
    username: account?.username ?? null,
    avatarUrl: account?.avatarUrl ?? null,
  };

  return (
    <div className={`cms ${grotesk.variable} ${mono.variable}`}>
      <AdminShell user={user} unread={unread}>
        {children}
      </AdminShell>
    </div>
  );
}
