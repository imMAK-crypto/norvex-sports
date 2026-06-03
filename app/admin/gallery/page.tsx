import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteGallery } from './actions';

export default async function GalleryAdminPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return (
    <AdminListShell title="Gallery" newHref="/admin/gallery/new" newLabel="Add image">
      {items.length === 0 ? (
        <p className="p-6 text-sm text-silver-100/50">No gallery items yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-lg border border-white/10">
              <img src={g.imageUrl} alt={g.title} className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                <p className="text-xs font-semibold truncate text-silver-100">{g.title}</p>
                <p className="text-[10px] text-silver-100/60">{g.category}</p>
              </div>
              <div className="absolute inset-0 grid place-items-center gap-3 bg-black/70 opacity-0 transition group-hover:opacity-100">
                <Link href={`/admin/gallery/${g.id}`} className="btn-outline text-xs">Edit</Link>
                <form action={deleteGallery}>
                  <input type="hidden" name="id" value={g.id} />
                  <DeleteButton />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminListShell>
  );
}
