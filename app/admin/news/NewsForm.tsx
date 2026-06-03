'use client';

import { ImageInput } from '../_components/ImageInput';

type NewsData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  isPublished?: boolean;
  tags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function toLocalDate(d?: Date | null) {
  if (!d) return '';
  const x = new Date(d);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
}

export function NewsForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: NewsData }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" required defaultValue={initial?.title ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug (auto if blank)</label>
          <input id="slug" name="slug" defaultValue={initial?.slug ?? ''} className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="excerpt">Excerpt *</label>
        <input id="excerpt" name="excerpt" required defaultValue={initial?.excerpt ?? ''} className="input" />
      </div>

      <div>
        <label className="label" htmlFor="body">Body *</label>
        <textarea id="body" name="body" rows={12} required defaultValue={initial?.body ?? ''} className="input" placeholder="Plain text; blank lines separate paragraphs." />
      </div>

      <ImageInput name="imageUrl" defaultValue={initial?.imageUrl ?? ''} folder="norvex/news" label="Cover image" />

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="author">Author</label>
          <input id="author" name="author" defaultValue={initial?.author ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="publishedAt">Publish date</label>
          <input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={toLocalDate(initial?.publishedAt)} className="input" />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? false} className="h-4 w-4" />
            Published
          </label>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="tags">Tags (comma-separated)</label>
        <input id="tags" name="tags" defaultValue={(initial?.tags ?? []).join(', ')} className="input" />
      </div>

      <details className="rounded-lg border border-white/10 p-4">
        <summary className="cursor-pointer text-sm text-silver-100/70">SEO overrides</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="metaTitle">Meta title</label>
            <input id="metaTitle" name="metaTitle" defaultValue={initial?.metaTitle ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="metaDescription">Meta description</label>
            <textarea id="metaDescription" name="metaDescription" rows={2} defaultValue={initial?.metaDescription ?? ''} className="input" />
          </div>
        </div>
      </details>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">Save</button>
        <a href="/admin/news" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
