'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const schema = z.object({
  title: z.string().min(1).max(160),
  caption: z.string().max(280).optional().or(z.literal('')),
  imageUrl: z.string().min(1).max(2048),
  category: z.string().max(80).optional().or(z.literal('')),
  order: z.string().optional().or(z.literal('')),
  isActive: z.string().optional().or(z.literal('')),
});

function read(fd: FormData) {
  const obj: Record<string, string> = {};
  for (const k of Object.keys(schema.shape)) obj[k] = String(fd.get(k) ?? '');
  return obj as z.input<typeof schema>;
}

function shape(d: z.infer<typeof schema>) {
  return {
    title: d.title,
    caption: d.caption || null,
    imageUrl: d.imageUrl,
    category: d.category || 'General',
    order: d.order ? Number(d.order) : 0,
    isActive: d.isActive === 'on',
  };
}

export async function createGallery(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.galleryItem.create({ data: shape(d) });
  revalidatePath('/gallery');
  redirect('/admin/gallery');
}

export async function updateGallery(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.galleryItem.update({ where: { id }, data: shape(d) });
  revalidatePath('/gallery');
  redirect('/admin/gallery');
}

export async function deleteGallery(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath('/gallery');
}
