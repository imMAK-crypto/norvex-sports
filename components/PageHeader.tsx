import { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink-500 bg-ink-900">
      {/* subtle grid only — no red radial */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="container-x relative py-16 md:py-24">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="headline mt-3 text-5xl md:text-6xl lg:text-7xl text-silver-100 leading-[0.95]">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-base md:text-lg text-silver-300">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
