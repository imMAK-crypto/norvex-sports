'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { destroyAsset } from '@/lib/cloudinary';

type Result = { ok: boolean; message?: string };

export async function deleteAsset(id: string): Promise<Result> {
  await requireAdmin();
  if (!id) return { ok: false, message: 'Missing id' };
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { ok: false, message: 'Already removed' };
  if (asset.publicId) await destroyAsset(asset.publicId);
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath('/nvx-panel-7q2/media');
  revalidatePath('/nvx-panel-7q2');
  return { ok: true, message: 'Asset deleted' };
}

export async function updateAssetAlt(id: string, alt: string): Promise<Result> {
  await requireAdmin();
  if (!id) return { ok: false, message: 'Missing id' };
  await prisma.mediaAsset.update({ where: { id }, data: { alt: alt || null } });
  revalidatePath('/nvx-panel-7q2/media');
  return { ok: true, message: 'Alt text saved' };
}
