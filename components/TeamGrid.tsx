'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

export type TeamGridMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
};

export function TeamGrid({ members }: { members: TeamGridMember[] }) {
  return (
    <div className="mx-auto grid max-w-[880px] grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-8">
      {members.map((m) => (
        <TeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}

function TeamCard({ member }: { member: TeamGridMember }) {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  // Show "Read More" only when the bio actually overflows the clamp
  // (6 lines on desktop, 5 on mobile). Re-check on resize since the line
  // count — and therefore overflow — changes with the breakpoint.
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    const measure = () => {
      if (expanded) return; // only measurable while clamped
      setCanExpand(el.scrollHeight > el.clientHeight + 2);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [expanded, member.bio]);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-ink-500 bg-ink-800">
      {/* Square 1:1 photo filling the card width */}
      <div className="relative aspect-square w-full bg-ink-700">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="(min-width: 640px) 420px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-8xl text-brand-600/40">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 md:p-7">
        <h3 className="font-display text-3xl md:text-4xl uppercase leading-none tracking-wide text-silver-100">
          {member.name}
        </h3>
        <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
          {member.role}
        </p>

        {member.bio && (
          <p
            ref={bioRef}
            className={`mt-4 text-sm leading-relaxed text-silver-200 md:text-base ${
              expanded ? '' : 'line-clamp-5 md:line-clamp-6'
            }`}
          >
            {member.bio}
          </p>
        )}

        {member.bio && (canExpand || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border border-brand-600 px-5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-500 transition hover:bg-brand-600 hover:text-silver-100"
          >
            {expanded ? (
              <>
                Read Less <Minus className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Read More <Plus className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
