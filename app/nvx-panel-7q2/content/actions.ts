'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const ALLOWED = new Set([
  'site.tagline',
  'site.aboutShort',
  'site.aboutLong',
  'site.projectStatement',
  'contact.phone',
  'contact.email',
  'contact.whatsapp',
  'contact.location',
  'contact.careersEmail',
  'social.instagram',
  'social.facebook',
  'social.linkedin',
  'social.youtube',
]);

export async function saveSiteContent(fd: FormData) {
  await requireAdmin();
  const updates: Array<{ key: string; value: string }> = [];
  for (const [key, value] of fd.entries()) {
    if (ALLOWED.has(key)) updates.push({ key, value: String(value) });
  }
  await Promise.all(
    updates.map(({ key, value }) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );
  revalidatePath('/', 'layout');
}
