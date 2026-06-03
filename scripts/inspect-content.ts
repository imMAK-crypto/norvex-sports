import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' }, select: { id: true, order: true, title: true, slug: true, imageUrl: true } });
  const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, title: true, slug: true, imageUrl: true } });
  const news = await prisma.newsPost.findMany({ orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, slug: true, imageUrl: true } });
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true, role: true, imageUrl: true } });
  const gallery = await prisma.galleryItem.findMany({ orderBy: { order: 'asc' }, select: { id: true, title: true, imageUrl: true } });

  console.log('--- SERVICES ---'); services.forEach(s => console.log(`  [${s.order}] ${s.title}  (${s.slug})\n        ${s.imageUrl ?? '(no image)'}`));
  console.log('\n--- EVENTS ---'); events.forEach(e => console.log(`  ${e.title} (${e.slug})\n        ${e.imageUrl ?? '(no image)'}`));
  console.log('\n--- NEWS ---'); news.forEach(n => console.log(`  ${n.title} (${n.slug})\n        ${n.imageUrl ?? '(no image)'}`));
  console.log('\n--- TEAM ---'); team.forEach(t => console.log(`  ${t.name} — ${t.role}\n        ${t.imageUrl ?? '(no image)'}`));
  console.log('\n--- GALLERY ---'); gallery.forEach(g => console.log(`  ${g.title ?? '(untitled)'}\n        ${g.imageUrl ?? '(no image)'}`));
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
