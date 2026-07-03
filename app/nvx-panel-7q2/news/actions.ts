'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/slug';

const schema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().max(140).optional().or(z.literal('')),
  excerpt: z.string().min(2).max(400),
  body: z.string().min(2).max(20000),
  imageUrl: z.string().max(2048).optional().or(z.literal('')),
  author: z.string().max(120).optional().or(z.literal('')),
  publishedAt: z.string().optional().or(z.literal('')),
  isPublished: z.string().optional().or(z.literal('')),
  tags: z.string().max(400).optional().or(z.literal('')),
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
    excerpt: d.excerpt,
    body: d.body,
    imageUrl: d.imageUrl || null,
    author: d.author || null,
    publishedAt: d.publishedAt ? new Date(d.publishedAt) : (d.isPublished === 'on' ? new Date() : null),
    isPublished: d.isPublished === 'on',
    tags: d.tags ? d.tags.split(/[,\n]+/).map((t) => t.trim()).filter(Boolean) : [],
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
  };
}

export async function createNews(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.newsPost.create({ data: shape(d) });
  revalidatePath('/news');
  revalidatePath('/');
  redirect('/nvx-panel-7q2/news');
}

export async function updateNews(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.newsPost.update({ where: { id }, data: shape(d) });
  revalidatePath('/news');
  revalidatePath('/');
  redirect('/nvx-panel-7q2/news');
}

export async function deleteNews(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath('/news');
  revalidatePath('/');
}
