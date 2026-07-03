'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(160),
  bio: z.string().max(4000).optional().or(z.literal('')),
  qualifications: z.string().max(400).optional().or(z.literal('')),
  experience: z.string().max(400).optional().or(z.literal('')),
  imageUrl: z.string().max(2048).optional().or(z.literal('')),
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
    name: d.name,
    role: d.role,
    bio: d.bio || null,
    qualifications: d.qualifications || null,
    experience: d.experience || null,
    imageUrl: d.imageUrl || null,
    order: d.order ? Number(d.order) : 0,
    isActive: d.isActive === 'on',
  };
}

export async function createTeam(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.teamMember.create({ data: shape(d) });
  revalidatePath('/team');
  redirect('/nvx-panel-7q2/team');
}

export async function updateTeam(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  await prisma.teamMember.update({ where: { id }, data: shape(d) });
  revalidatePath('/team');
  redirect('/nvx-panel-7q2/team');
}

export async function deleteTeam(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath('/team');
}
