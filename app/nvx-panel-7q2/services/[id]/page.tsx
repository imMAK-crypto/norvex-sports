import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceForm } from '../ServiceForm';
import { updateService } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) notFound();
  const action = updateService.bind(null, s.id);
  return (
    <ServiceForm
      action={action}
      initial={s}
      crumb="SERVICES / EDIT"
      title={`Edit · ${s.title}`}
      viewHref={`/services/${s.slug}`}
    />
  );
}
