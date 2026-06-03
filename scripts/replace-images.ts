import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Keep services 01 + 02; replace 03–08.
const SERVICE_MAP: Record<string, string> = {
  'advanced-player-development':   '/uploads/advanced-development.jpg',
  'adult-football-training':       '/uploads/more-than-training.jpg',
  'tournament-event-organization': '/uploads/banner-bw.webp',
  'school-college-coaching':       '/uploads/school-college.jpg',
  'fitness-conditioning':          '/uploads/advanced-development.jpg',
  'talent-identification-trials':  '/uploads/trials.png',
};

const EVENT_MAP: Record<string, string> = {
  'football-themed-birthday-parties':     '/uploads/birthday-parties.png',
  'friendly-matches-seasonal-tournaments':'/uploads/training-1.jpg',
  'talent-identification-trials':         '/uploads/trials.png',
  'football-development-clinics':         '/uploads/training-2.jpg',
  'norvex-youth-league':                  '/uploads/banner-bw.webp',
};

const NEWS_MAP: Record<string, string> = {
  'welcome-to-norvex-sports':     '/uploads/training-1.jpg',
  'open-trials-announcement':     '/uploads/trials.png',
  'norvex-youth-league-kick-off': '/uploads/banner-bw.webp',
};

async function main() {
  console.log('--- Services (skipping 01 & 02) ---');
  for (const [slug, url] of Object.entries(SERVICE_MAP)) {
    const r = await prisma.service.updateMany({ where: { slug }, data: { imageUrl: url } });
    console.log(`  ${slug}  -> ${url}  (${r.count} row)`);
  }
  console.log('\n--- Events ---');
  for (const [slug, url] of Object.entries(EVENT_MAP)) {
    const r = await prisma.event.updateMany({ where: { slug }, data: { imageUrl: url } });
    console.log(`  ${slug}  -> ${url}  (${r.count} row)`);
  }
  console.log('\n--- News ---');
  for (const [slug, url] of Object.entries(NEWS_MAP)) {
    const r = await prisma.newsPost.updateMany({ where: { slug }, data: { imageUrl: url } });
    console.log(`  ${slug}  -> ${url}  (${r.count} row)`);
  }

  const kept = await prisma.service.findMany({
    where: { slug: { in: ['football-development-program', 'one-to-one-coaching'] } },
    select: { slug: true, imageUrl: true },
  });
  console.log('\n--- Kept (unchanged) ---');
  kept.forEach(k => console.log(`  ${k.slug}  -> ${k.imageUrl}`));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
