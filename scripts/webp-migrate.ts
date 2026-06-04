import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function toWebp(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (!url.startsWith('/images/')) return url;
  return url.replace(/\.(png|jpe?g)$/i, '.webp');
}

async function migrate<T extends { id: string; imageUrl: string | null }>(
  label: string,
  findMany: () => Promise<T[]>,
  update: (id: string, imageUrl: string) => Promise<unknown>,
) {
  const rows = await findMany();
  let changed = 0;
  for (const r of rows) {
    const next = toWebp(r.imageUrl);
    if (next && next !== r.imageUrl) {
      await update(r.id, next);
      changed++;
      console.log(`  ${label}#${r.id}: ${r.imageUrl} -> ${next}`);
    }
  }
  console.log(`${label}: ${changed} row(s) updated`);
}

async function main() {
  await migrate(
    'Service',
    () => prisma.service.findMany({ select: { id: true, imageUrl: true } }),
    (id, imageUrl) => prisma.service.update({ where: { id }, data: { imageUrl } }),
  );
  await migrate(
    'Event',
    () => prisma.event.findMany({ select: { id: true, imageUrl: true } }),
    (id, imageUrl) => prisma.event.update({ where: { id }, data: { imageUrl } }),
  );
  await migrate(
    'NewsPost',
    () => prisma.newsPost.findMany({ select: { id: true, imageUrl: true } }),
    (id, imageUrl) => prisma.newsPost.update({ where: { id }, data: { imageUrl } }),
  );
  await migrate(
    'TeamMember',
    () => prisma.teamMember.findMany({ select: { id: true, imageUrl: true } }),
    (id, imageUrl) => prisma.teamMember.update({ where: { id }, data: { imageUrl } }),
  );

  const gallery = await prisma.galleryItem.findMany({ select: { id: true, imageUrl: true } });
  let g = 0;
  for (const r of gallery) {
    const next = toWebp(r.imageUrl);
    if (next && next !== r.imageUrl) {
      await prisma.galleryItem.update({ where: { id: r.id }, data: { imageUrl: next } });
      g++;
      console.log(`  GalleryItem#${r.id}: ${r.imageUrl} -> ${next}`);
    }
  }
  console.log(`GalleryItem: ${g} row(s) updated`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
