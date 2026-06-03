import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const r = await prisma.event.updateMany({
    where: { slug: 'football-themed-birthday-parties' },
    data: { imageUrl: '/images/birthday-party.jpg' },
  });
  console.log(`Updated ${r.count} event row(s) -> /images/birthday-party.jpg`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
