import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminFormShell } from '../../_components/AdminListShell';
import { GalleryForm } from '../GalleryForm';
import { updateGallery } from '../actions';

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const g = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!g) notFound();
  const action = updateGallery.bind(null, g.id);
  return (
    <AdminFormShell title={`Edit · ${g.title}`}>
      <GalleryForm action={action} initial={g} />
    </AdminFormShell>
  );
}
