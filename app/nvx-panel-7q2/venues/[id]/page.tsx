import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { VenueForm } from '../VenueForm';
import { updateVenue } from '../actions';

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await prisma.venue.findUnique({ where: { id } });
  if (!v) notFound();
  const action = updateVenue.bind(null, v.id);
  return (
    <AdminFormShell title={`Edit · ${v.name}`}>
      <VenueForm action={action} initial={v} />
    </AdminFormShell>
  );
}
