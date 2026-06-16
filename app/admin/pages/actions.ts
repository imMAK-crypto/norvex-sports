'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { EDITABLE_PAGE_KEYS } from '@/lib/settings';

const ALLOWED = new Set(EDITABLE_PAGE_KEYS);

type Result = { ok: boolean; message?: string };

/**
 * Generic save for any of the Page editors. Only keys on the allow-list are
 * written, so a tampered form can't set arbitrary settings. Used by every
 * /admin/pages/* editor — each form just submits its own subset of fields.
 */
export async function savePageSettings(fd: FormData): Promise<Result> {
  await requireAdmin();
  const updates: Array<{ key: string; value: string }> = [];
  for (const [key, value] of fd.entries()) {
    if (ALLOWED.has(key)) updates.push({ key, value: String(value) });
  }
  if (updates.length === 0) return { ok: false, message: 'Nothing to save' };

  await Promise.all(
    updates.map(({ key, value }) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );
  // Page content is read across the whole public site — revalidate everything.
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Changes saved & published' };
}

/* ----------------------------- Job postings ----------------------------- */

export async function createJob(fd: FormData): Promise<Result> {
  await requireAdmin();
  const title = String(fd.get('title') ?? '').trim();
  if (!title) return { ok: false, message: 'Title is required' };
  const count = await prisma.jobPosting.count();
  await prisma.jobPosting.create({
    data: {
      title,
      type: String(fd.get('type') ?? '') || null,
      location: String(fd.get('location') ?? '') || null,
      description: String(fd.get('description') ?? ''),
      applyUrl: String(fd.get('applyUrl') ?? '') || null,
      isOpen: true,
      order: count,
    },
  });
  revalidatePath('/admin/pages/careers');
  revalidatePath('/careers');
  return { ok: true, message: 'Role added' };
}

export async function updateJob(id: string, fd: FormData): Promise<Result> {
  await requireAdmin();
  if (!id) return { ok: false, message: 'Missing id' };
  await prisma.jobPosting.update({
    where: { id },
    data: {
      title: String(fd.get('title') ?? '').trim(),
      type: String(fd.get('type') ?? '') || null,
      location: String(fd.get('location') ?? '') || null,
      description: String(fd.get('description') ?? ''),
      applyUrl: String(fd.get('applyUrl') ?? '') || null,
    },
  });
  revalidatePath('/admin/pages/careers');
  revalidatePath('/careers');
  return { ok: true, message: 'Role updated' };
}

export async function toggleJob(id: string, isOpen: boolean): Promise<Result> {
  await requireAdmin();
  if (!id) return { ok: false, message: 'Missing id' };
  await prisma.jobPosting.update({ where: { id }, data: { isOpen } });
  revalidatePath('/admin/pages/careers');
  revalidatePath('/careers');
  return { ok: true, message: isOpen ? 'Role opened' : 'Role closed' };
}

export async function deleteJob(id: string): Promise<Result> {
  await requireAdmin();
  if (!id) return { ok: false, message: 'Missing id' };
  await prisma.jobPosting.delete({ where: { id } });
  revalidatePath('/admin/pages/careers');
  revalidatePath('/careers');
  return { ok: true, message: 'Role deleted' };
}
