import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { EventForm } from '../EventForm';
import { updateEvent } from '../actions';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await prisma.event.findUnique({ where: { id } });
  if (!e) notFound();
  const action = updateEvent.bind(null, e.id);
  return (
    <AdminFormShell title={`Edit · ${e.title}`}>
      <EventForm action={action} initial={e} />
    </AdminFormShell>
  );
}
