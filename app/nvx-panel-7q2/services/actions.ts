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
  shortDesc: z.string().min(2).max(280),
  longDesc: z.string().min(2).max(8000),
  imageUrl: z.string().max(2048).optional().or(z.literal('')),
  icon: z.string().max(40).optional().or(z.literal('')),
  order: z.string().optional().or(z.literal('')),
  isActive: z.string().optional().or(z.literal('')),
  metaTitle: z.string().max(200).optional().or(z.literal('')),
  metaDescription: z.string().max(400).optional().or(z.literal('')),
});

function fromFormData(fd: FormData) {
  return {
    title: String(fd.get('title') ?? ''),
    slug: String(fd.get('slug') ?? ''),
    shortDesc: String(fd.get('shortDesc') ?? ''),
    longDesc: String(fd.get('longDesc') ?? ''),
    imageUrl: String(fd.get('imageUrl') ?? ''),
    icon: String(fd.get('icon') ?? ''),
    order: String(fd.get('order') ?? ''),
    isActive: String(fd.get('isActive') ?? ''),
    metaTitle: String(fd.get('metaTitle') ?? ''),
    metaDescription: String(fd.get('metaDescription') ?? ''),
  };
}

export async function createService(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(fromFormData(fd));
  const slug = d.slug ? slugify(d.slug) : slugify(d.title);
  await prisma.service.create({
    data: {
      title: d.title,
      slug,
      shortDesc: d.shortDesc,
      longDesc: d.longDesc,
      imageUrl: d.imageUrl || null,
      icon: d.icon || null,
      order: d.order ? Number(d.order) : 0,
      isActive: d.isActive === 'on',
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });
  revalidatePath('/services');
  revalidatePath('/');
  redirect('/nvx-panel-7q2/services');
}

export async function updateService(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(fromFormData(fd));
  await prisma.service.update({
    where: { id },
    data: {
      title: d.title,
      slug: d.slug ? slugify(d.slug) : slugify(d.title),
      shortDesc: d.shortDesc,
      longDesc: d.longDesc,
      imageUrl: d.imageUrl || null,
      icon: d.icon || null,
      order: d.order ? Number(d.order) : 0,
      isActive: d.isActive === 'on',
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });
  revalidatePath('/services');
  revalidatePath('/');
  redirect('/nvx-panel-7q2/services');
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.service.delete({ where: { id } });
  revalidatePath('/services');
  revalidatePath('/');
}
