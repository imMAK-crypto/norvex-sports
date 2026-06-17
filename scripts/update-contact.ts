import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates: Record<string, string> = {
  'contact.phone': '+91 80899 20562',
  'contact.email': 'admin@norvexsports.in',
  'contact.whatsapp': '918089920562',
  'contact.location': 'Hyderabad, Telangana, India',
  'contact.careersEmail': 'hr@norvexsports.in',
  'social.instagram': 'https://www.instagram.com/norvexsports?igsh=MXVtOXEwdmFwb3B2YQ==',
  'social.facebook': 'https://www.facebook.com/share/1B2MxrehXu/',
  'social.linkedin': 'https://www.linkedin.com/company/norvex-sports/',
  'social.youtube': '',
  'social.threads': 'https://www.threads.com/@norvexsports',
  'social.x': 'https://x.com/NORVEXSPORTS',
};

async function main() {
  for (const [key, value] of Object.entries(updates)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`  ${key} = ${value || '(empty)'}`);
  }
  const all = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'contact.' } } });
  console.log('\nFinal contact.* in DB:');
  for (const r of all) console.log(`  ${r.key} = ${r.value}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
