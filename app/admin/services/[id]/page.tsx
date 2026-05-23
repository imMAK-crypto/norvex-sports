import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { ServiceForm } from '../ServiceForm';
import { updateService } from '../actions';

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const s = await prisma.service.findUnique({ where: { id: params.id } });
  if (!s) notFound();
  const action = updateService.bind(null, s.id);
  return (
    <AdminFormShell title={`Edit · ${s.title}`}>
      <ServiceForm action={action} initial={s} />
    </AdminFormShell>
  );
}
