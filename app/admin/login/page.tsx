import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Admin Sign In', robots: { index: false, follow: false } };

export default function AdminLogin({ searchParams }: { searchParams?: { next?: string; error?: string } }) {
  return (
    <main className="min-h-screen grid place-items-center bg-ink-950 text-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl">Norvex Admin</h1>
          <p className="text-sm text-white/50 mt-1">Sign in to manage the site</p>
        </div>
        <LoginForm next={searchParams?.next} initialError={searchParams?.error} />
      </div>
    </main>
  );
}
