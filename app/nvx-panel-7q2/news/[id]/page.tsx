import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { NewsForm } from '../NewsForm';
import { updateNews } from '../actions';

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const p = await prisma.newsPost.findUnique({ where: { id: params.id } });
  if (!p) notFound();
  const action = updateNews.bind(null, p.id);
  return (
    <AdminFormShell title={`Edit · ${p.title}`}>
      <NewsForm action={action} initial={p} />
    </AdminFormShell>
  );
}
