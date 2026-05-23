import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminListShell } from '../_components/AdminListShell';
import { DeleteButton } from '../_components/DeleteButton';
import { deleteNews } from './actions';

export default async function NewsAdminPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }] });
  return (
    <AdminListShell title="News" newHref="/admin/news/new" newLabel="New post">
      {posts.length === 0 ? (
        <p className="p-6 text-sm text-white/50">No posts yet.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {p.title}
                  {!p.isPublished && <span className="ml-2 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-300">DRAFT</span>}
                </p>
                <p className="text-xs text-white/50 truncate">/news/{p.slug} · {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'unpublished'}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/news/${p.id}`} className="text-xs text-brand-400 hover:underline">Edit</Link>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={p.id} />
                  <DeleteButton />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminListShell>
  );
}
