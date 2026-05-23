import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Norvex Sports — home">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 shadow-lg shadow-brand-700/30">
        <span className="font-display text-xl leading-none text-black">N</span>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-[0.08em] text-white">NORVEX</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-400">Sports</span>
      </span>
    </Link>
  );
}
