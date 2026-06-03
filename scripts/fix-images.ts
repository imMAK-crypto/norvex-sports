import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// All verified 200 OK as of this run
async function main() {
  // Events — replace dead photo for norvex-youth-league
  await prisma.event.update({
    where: { slug: 'norvex-youth-league' },
    data: { imageUrl: u('photo-1486286701208-1d58e9338013') }, // youth football match
  });
  // News — same photo was used here, replace too
  await prisma.newsPost.update({
    where: { slug: 'norvex-youth-league-kick-off' },
    data: { imageUrl: u('photo-1517747614396-d21a78b850e8') }, // close-up of football boot/kick
  });
  console.log('Replaced 2 dead-image references.');

  // Audit every imageUrl currently in DB
  const all = [
    ...(await prisma.service.findMany({ select: { slug: true, imageUrl: true } })),
    ...(await prisma.event.findMany({ select: { slug: true, imageUrl: true } })),
    ...(await prisma.newsPost.findMany({ select: { slug: true, imageUrl: true } })),
  ];
  const broken: string[] = [];
  for (const r of all) {
    if (!r.imageUrl) continue;
    try {
      const res = await fetch(r.imageUrl, { method: 'HEAD' });
      if (!res.ok) {
        broken.push(`${r.slug}: ${res.status} ${r.imageUrl}`);
      }
    } catch (e: any) {
      broken.push(`${r.slug}: ERROR ${e.message}`);
    }
  }
  if (broken.length) {
    console.log('\nSTILL BROKEN:');
    broken.forEach((b) => console.log('  ✗', b));
  } else {
    console.log(`\nAll ${all.length} imageUrls return 200 ✓`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
