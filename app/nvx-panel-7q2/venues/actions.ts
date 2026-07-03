'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { resolveMapLink } from '@/lib/venue';
import { pingIndexNow } from '@/lib/indexnow';

const schema = z.object({
  name: z.string().min(2).max(160),
  mapUrl: z.string().url().max(2048),
  address: z.string().max(600).optional().or(z.literal('')),
  lat: z.string().optional().or(z.literal('')),
  lng: z.string().optional().or(z.literal('')),
  isPrimary: z.string().optional().or(z.literal('')),
  order: z.string().optional().or(z.literal('')),
  isActive: z.string().optional().or(z.literal('')),
});

/** Parse a coordinate field; accepts a raw number or a "lat,lng" pasted pair. */
function num(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(String(v).trim().split(',')[0]);
  return Number.isFinite(n) ? n : null;
}

function read(fd: FormData) {
  const obj: Record<string, string> = {};
  for (const k of Object.keys(schema.shape)) obj[k] = String(fd.get(k) ?? '');
  return obj as z.input<typeof schema>;
}

async function shape(d: z.infer<typeof schema>) {
  // Auto-build the embed + fill the address/coords from the share link on save.
  const resolved = await resolveMapLink(d.mapUrl, d.address || undefined);
  // Admin-typed coordinates win over auto-detected ones.
  const lat = num(d.lat) ?? resolved.lat;
  const lng = num(d.lng) ?? resolved.lng;
  return {
    name: d.name.trim(),
    mapUrl: d.mapUrl.trim(),
    address: (d.address?.trim() || resolved.address) ?? null,
    embedUrl: resolved.embedUrl,
    lat,
    lng,
    isPrimary: d.isPrimary === 'on',
    order: d.order ? Number(d.order) : 0,
    isActive: d.isActive === 'on',
  };
}

// Only one venue can be the primary/main location at a time.
async function enforceSinglePrimary(id: string | null, isPrimary: boolean) {
  if (!isPrimary) return;
  await prisma.venue.updateMany({
    where: id ? { isPrimary: true, NOT: { id } } : { isPrimary: true },
    data: { isPrimary: false },
  });
}

export async function createVenue(fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  const data = await shape(d);
  const created = await prisma.venue.create({ data });
  await enforceSinglePrimary(created.id, data.isPrimary);
  // Venues now surface on the location page AND the home + contact venue blocks.
  revalidatePath('/location');
  revalidatePath('/');
  revalidatePath('/contact');
  await pingIndexNow(['/location']);
  redirect('/nvx-panel-7q2/venues');
}

export async function updateVenue(id: string, fd: FormData) {
  await requireAdmin();
  const d = schema.parse(read(fd));
  const data = await shape(d);
  await enforceSinglePrimary(id, data.isPrimary);
  await prisma.venue.update({ where: { id }, data });
  // Venues now surface on the location page AND the home + contact venue blocks.
  revalidatePath('/location');
  revalidatePath('/');
  revalidatePath('/contact');
  await pingIndexNow(['/location']);
  redirect('/nvx-panel-7q2/venues');
}

export async function deleteVenue(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id) return;
  await prisma.venue.delete({ where: { id } });
  // Venues now surface on the location page AND the home + contact venue blocks.
  revalidatePath('/location');
  revalidatePath('/');
  revalidatePath('/contact');
  await pingIndexNow(['/location']);
}
