/**
 * Tiny in-memory rate limiter — sufficient for a single-instance Railway deploy.
 * For multi-region or multi-replica, swap in @upstash/ratelimit + Redis.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfterSec: 0 };
  }
  b.count += 1;
  if (b.count > max) {
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: max - b.count, retryAfterSec: 0 };
}

export function clientKey(req: { headers: Headers | { get: (k: string) => string | null } }, prefix: string): string {
  const get = (k: string) =>
    req.headers instanceof Headers ? req.headers.get(k) : req.headers.get?.(k);
  const ip =
    get('cf-connecting-ip') ||
    get('x-forwarded-for')?.split(',')[0]?.trim() ||
    get('x-real-ip') ||
    'unknown';
  return `${prefix}:${ip}`;
}

// Periodic cleanup of expired buckets so memory doesn't grow forever.
if (typeof setInterval !== 'undefined' && !(globalThis as { __rlCleanup?: boolean }).__rlCleanup) {
  (globalThis as { __rlCleanup?: boolean }).__rlCleanup = true;
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
  }, 60_000).unref?.();
}
