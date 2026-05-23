import { ReactNode } from 'react';

export function Section({
  children,
  className = '',
  eyebrow,
  title,
  intro,
  id,
}: {
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container-x">
        {(eyebrow || title || intro) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="headline mt-3 text-4xl md:text-5xl text-white">{title}</h2>}
            {intro && <p className="mt-4 text-white/70">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
