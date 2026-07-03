import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center bg-ink-900">
      <div className="container-x py-24 text-center">
        <p className="font-display text-8xl md:text-9xl text-brand-600 leading-none">404</p>
        <h1 className="headline mt-6 text-4xl md:text-6xl text-silver-100">Off target.</h1>
        <p className="mt-4 text-silver-300">The page you&apos;re looking for isn&apos;t on the pitch.</p>
        <Link href="/" className="btn-primary mt-8">Back to Home</Link>
      </div>
    </div>
  );
}
