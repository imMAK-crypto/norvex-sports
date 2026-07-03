'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const LABELS = ['new', 'lead', 'followup', 'scam', 'closed'];

export async function markRead(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.contactSubmission.update({ where: { id }, data: { isRead: true } });
  revalidatePath('/nvx-panel-7q2/contacts');
  revalidatePath('/nvx-panel-7q2');
}

export async function setRead(id: string, isRead: boolean) {
  await requireAdmin();
  if (!id) return { ok: false as const, message: 'Missing id' };
  await prisma.contactSubmission.update({ where: { id }, data: { isRead } });
  revalidatePath('/nvx-panel-7q2/contacts');
  revalidatePath('/nvx-panel-7q2');
  return { ok: true as const, message: isRead ? 'Marked as read' : 'Marked as unread' };
}

export async function setLabel(id: string, label: string) {
  await requireAdmin();
  if (!id || !LABELS.includes(label)) return { ok: false as const, message: 'Invalid label' };
  await prisma.contactSubmission.update({ where: { id }, data: { label } });
  revalidatePath('/nvx-panel-7q2/contacts');
  return { ok: true as const, message: `Labelled "${label}"` };
}

export async function saveNote(id: string, note: string) {
  await requireAdmin();
  if (!id) return { ok: false as const, message: 'Missing id' };
  await prisma.contactSubmission.update({ where: { id }, data: { note: note || null } });
  revalidatePath('/nvx-panel-7q2/contacts');
  return { ok: true as const, message: 'Note saved' };
}

export async function deleteContact(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/nvx-panel-7q2/contacts');
  revalidatePath('/nvx-panel-7q2');
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  if (!id) return { ok: false as const, message: 'Missing id' };
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/nvx-panel-7q2/contacts');
  revalidatePath('/nvx-panel-7q2');
  return { ok: true as const, message: 'Enquiry deleted' };
}
