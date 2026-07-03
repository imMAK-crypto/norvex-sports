import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Credentials come from the environment — never hardcode them, this file ships
  // in the repo. Run: ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/create-admin.ts
  const email = (process.env.ADMIN_EMAIL ?? '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD ?? '';
  if (!email || password.length < 10) {
    console.error('Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (min 10 chars) in the environment before running.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash, name: 'Norvex Admin' },
    create: { email, passwordHash: hash, name: 'Norvex Admin' },
  });
  console.log('Admin user ready:', user.email, 'id:', user.id);

  // Refresh project statement in SiteSetting
  const projectStatement =
    'At Norvex Sports, our project is to create a structured and professional environment where athletes can develop their skills, confidence, and overall performance through expert coaching and continuous development. Starting with football, we aim to build a strong sports development platform that supports athletes from grassroots to elite levels while expanding across multiple sports and cities in the future. Through discipline, consistency, and competitive exposure, we strive to create opportunities that help individuals grow both on and off the field.';

  await prisma.siteSetting.upsert({
    where: { key: 'site.projectStatement' },
    update: { value: projectStatement },
    create: { key: 'site.projectStatement', value: projectStatement },
  });
  console.log('Project statement refreshed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
