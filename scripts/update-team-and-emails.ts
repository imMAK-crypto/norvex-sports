import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update team member names (match on the existing first-name forms used at seed time).
const TEAM_RENAMES: Array<{ from: string; to: string }> = [
  { from: 'Shoukath', to: 'Shoukkthali' },
  { from: 'Riyas', to: 'Riyas NM' },
  { from: 'Shuraih', to: 'Shuraih Sharaf' },
  { from: 'Minhaj', to: 'Muhammed Minhaj' },
];

const EMAIL_UPDATES: Record<string, string> = {
  'contact.email': 'admin@norvexsports.in',
  'contact.careersEmail': 'hr@norvexsports.in',
  'social.threads': 'https://www.threads.com/@norvexsports',
  'social.x': 'https://x.com/NORVEXSPORTS',
};

async function main() {
  console.log('--- Team renames ---');
  for (const { from, to } of TEAM_RENAMES) {
    const matches = await prisma.teamMember.findMany({
      where: { name: { startsWith: from, mode: 'insensitive' } },
      select: { id: true, name: true },
    });
    if (matches.length === 0) {
      console.log(`  (no match) ${from}`);
      continue;
    }
    for (const m of matches) {
      await prisma.teamMember.update({ where: { id: m.id }, data: { name: to } });
      console.log(`  ${m.name}  ->  ${to}`);
    }
  }

  console.log('\n--- Emails ---');
  for (const [key, value] of Object.entries(EMAIL_UPDATES)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`  ${key}  =  ${value}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
