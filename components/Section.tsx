import { ReactNode } from 'react';

const BORDER = '1px solid #2e2e2e';

export function Section({
  children,
  className = '',
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
  tight = false,
}: {
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  id?: string;
  align?: 'left' | 'center';
  tight?: boolean;
}) {
  const pad = tight ? 'py-10 md:py-16' : 'py-12 md:py-24';
  return (
    <section id={id} className={`${pad} ${className}`}>
      <div className="container-x">
        {(eyebrow || title || intro) && (
          <div className={`mb-8 md:mb-12 ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && (
              <h2 className="headline mt-3 text-4xl md:text-5xl lg:text-6xl text-silver-100">{title}</h2>
            )}
            {intro && <p className="mt-4 text-base md:text-lg text-silver-300 leading-relaxed">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * StatsBar — every cell carries full borders via inline styles so
 * no Tailwind purge or stacking glitch can break the grid. Each cell
 * is guaranteed boxed at 2-col mobile and 4-col desktop.
 */
export function StatsBar({ stats }: { stats: { num: string; label: string }[] }) {
  return (
    <div style={{ borderTop: BORDER, borderBottom: BORDER, background: '#0d0d0d' }}>
      <div className="container-x py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center py-6 md:py-8 px-4"
              style={{
                border: BORDER,
                marginLeft: -1,
                marginTop: -1,
                background: '#0d0d0d',
              }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-brand-600 tracking-wide leading-none">
                {s.num}
              </div>
              <div className="mt-3 font-sans text-[11px] uppercase tracking-[0.25em] text-silver-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
