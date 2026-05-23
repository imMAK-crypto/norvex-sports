'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function markRead(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.contactSubmission.update({ where: { id }, data: { isRead: true } });
  revalidatePath('/admin/contacts');
  revalidatePath('/admin');
}

export async function deleteContact(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/admin/contacts');
  revalidatePath('/admin');
}
