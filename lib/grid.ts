/**
 * Desktop-only "center the last incomplete row" helper for 3-up card grids.
 *
 * The grid container is rendered with 6 columns at the target breakpoint and
 * every card spans 2 columns (so 3 cards fill a row exactly — visually
 * identical to a 3-column grid). When the final row has 1 or 2 leftover cards,
 * we shift the first leftover card with a `col-start` offset so the group is
 * centered. Fully-filled rows are untouched, and because every class is keyed
 * to a desktop breakpoint, mobile/tablet layout is unaffected.
 *
 * All returned class strings are written out literally below so Tailwind's
 * content scanner picks them up (they are also safelisted in tailwind.config).
 */

type Bp = 'lg' | 'md';

/** Class for the grid container — replaces `<bp>:grid-cols-3`. */
export function centerGridClass(bp: Bp): string {
  return bp === 'lg' ? 'lg:grid-cols-6' : 'md:grid-cols-6';
}

/** Per-card span class — every card spans 2 of the 6 columns. */
export function centerCardSpan(bp: Bp): string {
  return bp === 'lg' ? 'lg:col-span-2' : 'md:col-span-2';
}

/**
 * Per-card offset for the first card of the last incomplete row.
 * Returns '' for every other card (and when the rows divide evenly).
 */
export function centerLastRow(bp: Bp, index: number, total: number): string {
  const remainder = total % 3;
  if (remainder === 0) return '';
  const firstLeftover = total - remainder;
  if (index !== firstLeftover) return '';
  if (bp === 'lg') return remainder === 1 ? 'lg:col-start-3' : 'lg:col-start-2';
  return remainder === 1 ? 'md:col-start-3' : 'md:col-start-2';
}
