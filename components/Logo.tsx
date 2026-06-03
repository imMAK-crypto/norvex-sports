import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Norvex Sports — home"
    >
      <Image
        src="/norvex_sports_logo.png"
        alt="Norvex Sports"
        width={755}
        height={364}
        priority
        className={`${compact ? 'h-10' : 'h-14 md:h-16'} w-auto transition-transform duration-300 group-hover:scale-[1.03]`}
      />
    </Link>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-bold uppercase tracking-[0.15em] text-brand-600 ${className}`}>
      NORVEX
    </span>
  );
}
