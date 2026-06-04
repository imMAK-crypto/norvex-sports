import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Excluded (keep as-is):
//  - Service: football-development-program
//  - Service: one-to-one-coaching (One-to-One & Community Coaching)
//  - Event:   football-themed-birthday-parties
const SERVICE_MAP: Record<string, string> = {
  'advanced-player-development':   '/images/service_advanced_player_development.webp',
  'adult-football-training':       '/images/service_adult_football_training.webp',
  'tournament-event-organization': '/images/service_tournament_event_organization.webp',
  'school-college-coaching':       '/images/service_school_college_coaching.webp',
  'fitness-conditioning':          '/images/service_fitness_conditioning.webp',
  'talent-identification-trials':  '/images/service_talent_identification_trials.webp',
};

const EVENT_MAP: Record<string, string> = {
  'norvex-youth-league':                   '/images/event_norvex_youth_league.webp',
  'friendly-matches-seasonal-tournaments': '/images/event_friendly_matches_tournaments.webp',
  'talent-identification-trials':          '/images/event_talent_identification_trials.webp',
  'football-development-clinics':          '/images/event_football_development_clinics.webp',
};

const NEWS_MAP: Record<string, string> = {
  'welcome-to-norvex-sports':     '/images/news_welcome_to_norvex.webp',
  'open-trials-announcement':     '/images/news_open_trials_announcement.webp',
  'norvex-youth-league-kick-off': '/images/news_youth_league_kickoff.webp',
};

async function main() {
  console.log('--- Services (excluding football-development-program & one-to-one-coaching) ---');
  for (const [slug, url] of Object.entries(SERVICE_MAP)) {
    const r = await prisma.service.updateMany({ where: { slug }, data: { imageUrl: url } });
    console.log(`  ${slug}  -> ${url}  (${r.count} row)`);
  }
  console.log('\n--- Events (excluding football-themed-birthday-parties) ---');
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
  console.log('\n--- Kept services (unchanged) ---');
  kept.forEach(k => console.log(`  ${k.slug}  -> ${k.imageUrl}`));

  const keptEvent = await prisma.event.findMany({
    where: { slug: 'football-themed-birthday-parties' },
    select: { slug: true, imageUrl: true },
  });
  console.log('\n--- Kept events (unchanged) ---');
  keptEvent.forEach(k => console.log(`  ${k.slug}  -> ${k.imageUrl}`));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
