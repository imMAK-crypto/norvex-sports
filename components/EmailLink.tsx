'use client';

import type { MouseEvent, ReactNode } from 'react';

/** Gmail web "compose" URL — opens a new message in the browser. */
function gmailComposeUrl(email: string, subject?: string) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email });
  if (subject) params.set('su', subject);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function mailtoUrl(email: string, subject?: string) {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}

/**
 * Email link with a smart Gmail-first behaviour:
 *  - plain left-click → opens Gmail web compose in a new tab
 *  - if the popup is blocked, or on right-click / copy-link / modifier-click /
 *    no-JS → falls back to the device's default mail app via `mailto:`
 */
export function EmailLink({
  email,
  subject,
  className,
  children,
}: {
  email: string;
  subject?: string;
  className?: string;
  children?: ReactNode;
}) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Leave non-primary / modifier clicks to the browser (mailto, copy, new tab…)
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const win = window.open(gmailComposeUrl(email, subject), '_blank');
    if (win) {
      win.opener = null;
      e.preventDefault(); // Gmail opened — don't also trigger the mailto fallback
    }
  }

  return (
    <a href={mailtoUrl(email, subject)} onClick={handleClick} className={className}>
      {children ?? email}
    </a>
  );
}
