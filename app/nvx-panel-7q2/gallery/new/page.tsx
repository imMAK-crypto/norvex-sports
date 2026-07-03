import { AdminFormShell } from '../../_components/AdminListShell';
import { GalleryForm } from '../GalleryForm';
import { createGallery } from '../actions';

export default function NewGalleryPage() {
  return (
    <AdminFormShell title="Add image">
      <GalleryForm action={createGallery} />
    </AdminFormShell>
  );
}
