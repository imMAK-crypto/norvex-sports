import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="headline mt-3 text-5xl md:text-7xl">Off target.</h1>
      <p className="mt-4 text-white/60">The page you're looking for isn't here.</p>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
