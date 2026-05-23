import { PrismaClient } from '@prisma/client';
import type {
  Event as EventModel,
  NewsPost as NewsPostModel,
  Service as ServiceModel,
  GalleryItem as GalleryItemModel,
  TeamMember as TeamMemberModel,
} from '@prisma/client';

export type { EventModel, NewsPostModel, ServiceModel, GalleryItemModel, TeamMemberModel };

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Run a DB query, returning `fallback` if the database is unreachable.
 * Used so static prerender does not blow up when DATABASE_URL is missing
 * during local builds (e.g. running `next build` without Postgres running).
 * In production on Railway, DATABASE_URL is always present.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[safeQuery] DB unavailable — using fallback.', err instanceof Error ? err.message : err);
    }
    return fallback;
  }
}
