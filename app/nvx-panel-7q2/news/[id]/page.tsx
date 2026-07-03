import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { NewsForm } from '../NewsForm';
import { updateNews } from '../actions';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.newsPost.findUnique({ where: { id } });
  if (!p) notFound();
  const action = updateNews.bind(null, p.id);
  return (
    <AdminFormShell title={`Edit · ${p.title}`}>
      <NewsForm action={action} initial={p} />
    </AdminFormShell>
  );
}
