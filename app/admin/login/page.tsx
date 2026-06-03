import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Admin Sign In', robots: { index: false, follow: false } };

export default function AdminLogin({ searchParams }: { searchParams?: { next?: string; error?: string } }) {
  return (
    <main className="min-h-screen grid place-items-center bg-ink-950 text-silver-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/norvex_sports_logo.png"
            alt="Norvex Sports"
            width={755}
            height={364}
            priority
            className="h-12 w-auto mx-auto"
          />
          <h1 className="mt-6 font-display text-3xl uppercase tracking-wide">Norvex Admin</h1>
          <p className="text-sm text-silver-300 mt-1">Sign in to manage the site</p>
        </div>
        <LoginForm next={searchParams?.next} initialError={searchParams?.error} />
        <p className="mt-6 text-center text-xs text-silver-500">
          Default credentials shown as placeholder — change after first login.
        </p>
      </div>
    </main>
  );
}
