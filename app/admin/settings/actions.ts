'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const schema = z
  .object({
    current: z.string().min(1),
    next: z.string().min(8, 'Min 8 chars').max(200),
    confirm: z.string().min(8).max(200),
  })
  .refine((v) => v.next === v.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export async function changePassword(fd: FormData) {
  const session = await requireAdmin();
  const parsed = schema.safeParse({
    current: String(fd.get('current') ?? ''),
    next: String(fd.get('next') ?? ''),
    confirm: String(fd.get('confirm') ?? ''),
  });
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0].message };
  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user) return { ok: false as const, message: 'User not found' };
  const ok = await bcrypt.compare(parsed.data.current, user.passwordHash);
  if (!ok) return { ok: false as const, message: 'Current password is incorrect' };
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 12) },
  });
  return { ok: true as const, message: 'Password updated.' };
}
