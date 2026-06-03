import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const SERVICES: Record<string, string> = {
  'football-development-program': u('photo-1431324155629-1a6deb1dec8d'),
  'one-to-one-coaching': u('photo-1577223625816-7546f13df25d'),
  'advanced-player-development': u('photo-1551958219-acbc608c6377'),
  'adult-football-training': u('photo-1521412644187-c49fa049e84d'),
  'tournament-event-organization': u('photo-1517466787929-bc90951d0974'),
  'school-college-coaching': u('photo-1599058917212-d750089bc07e'),
  'fitness-conditioning': u('photo-1571019613454-1cb2f99b2d8b'),
  'talent-identification-trials': u('photo-1543326727-cf6c39e8f84c'),
};

const EVENTS: Record<string, string> = {
  'norvex-youth-league': u('photo-1508098682722-e99c43a406b2'),
  'football-development-clinics': u('photo-1606851094291-6efae152bb87'),
  'talent-identification-trials': u('photo-1554244933-d876deb6b2ff'),
  'friendly-matches-seasonal-tournaments': u('photo-1574629810360-7efbbe195018'),
  'football-themed-birthday-parties': u('photo-1518604666860-9ed391f76460'),
};

const NEWS: Record<string, string> = {
  'welcome-to-norvex-sports': u('photo-1551958219-acbc608c6377'),
  'norvex-youth-league-kick-off': u('photo-1508098682722-e99c43a406b2'),
  'open-trials-announcement': u('photo-1554244933-d876deb6b2ff'),
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(SERVICES)) {
    await prisma.service.update({ where: { slug }, data: { imageUrl } }).catch((e) => {
      console.warn(`service ${slug}: ${e.message}`);
    });
  }
  console.log(`Services updated: ${Object.keys(SERVICES).length}`);

  for (const [slug, imageUrl] of Object.entries(EVENTS)) {
    await prisma.event.update({ where: { slug }, data: { imageUrl } }).catch((e) => {
      console.warn(`event ${slug}: ${e.message}`);
    });
  }
  console.log(`Events updated: ${Object.keys(EVENTS).length}`);

  for (const [slug, imageUrl] of Object.entries(NEWS)) {
    await prisma.newsPost.update({ where: { slug }, data: { imageUrl } }).catch((e) => {
      console.warn(`news ${slug}: ${e.message}`);
    });
  }
  console.log(`News updated: ${Object.keys(NEWS).length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
