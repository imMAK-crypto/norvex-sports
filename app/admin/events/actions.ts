'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/slug';

const schema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().max(120).optional().or(z.literal('')),
  summary: z.string().min(2).max(400),
  description: z.string().min(2).max(8000),
  date: z.string().optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  imageUrl: z.string().max(2048).optional().or(z.literal('')),
  galleryUrls: z.string().max(8000).optional().or(z.literal('')),
  category: z.string().max(60).optional().or(z.literal('')),
  registrationUrl: z.string().max(2048).optional().or(z.literal('')),
  isFeatured: z.string().optional().or(z.literal('')),
  isActive: z.string().optional().or(z.literal('')),
  metaTitle: z.string().max(200).optional().or(z.literal('')),
  metaDescription: z.string().max(400).optional().or(z.literal('')),
});

function read(fd: FormData) {
  const obj: Record<string, string> = {};
  for (const k of Object.keys(schema.shape)) obj[k] = String(fd.get(k) ?? '');
  return obj as z.input<typeof schema>;
}

function shape(d: z.infer<typeof schema>) {
  return {
    title: d.title,
    slug: d.slug ? slugify(d.slug) : slugify(d.title),
    summary: d.summary,
    description: d.description,
    date: d.date ? new Date(d.date) : null,
    location: d.location || null,
    imageUrl: d.imageUrl || null,
    galleryUrls: d.galleryUrls ? d.galleryUrls.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean) : [],
    category: d.category || null,
    registrationUrl: d.registrationUrl || null,
    isFeatured: d.isFeatured === 'on',
    isActive: d.isActive === 'on',
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
  };
}

export async function createEvent(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.event.create({ data: shape(d) });
  revalidatePath('/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function updateEvent(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.event.update({ where: { id }, data: shape(d) });
  revalidatePath('/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function deleteEvent(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath('/events');
  revalidatePath('/');
}
