'use client';

import { ImageInput } from '../_components/ImageInput';

type EventData = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  date?: Date | null;
  location?: string | null;
  imageUrl?: string | null;
  galleryUrls?: string[];
  category?: string | null;
  registrationUrl?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function toLocalDate(d?: Date | null) {
  if (!d) return '';
  const x = new Date(d);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
}

export function EventForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: EventData }) {
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
        <label className="label" htmlFor="summary">Summary *</label>
        <input id="summary" name="summary" required defaultValue={initial?.summary ?? ''} className="input" />
      </div>

      <div>
        <label className="label" htmlFor="description">Description *</label>
        <textarea id="description" name="description" rows={8} required defaultValue={initial?.description ?? ''} className="input" />
      </div>

      <ImageInput name="imageUrl" defaultValue={initial?.imageUrl ?? ''} folder="norvex/events" label="Cover image" />

      <div>
        <label className="label" htmlFor="galleryUrls">Gallery image URLs (one per line)</label>
        <textarea
          id="galleryUrls"
          name="galleryUrls"
          rows={3}
          defaultValue={(initial?.galleryUrls ?? []).join('\n')}
          className="input"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input id="date" name="date" type="datetime-local" defaultValue={toLocalDate(initial?.date)} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" name="location" defaultValue={initial?.location ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <input id="category" name="category" defaultValue={initial?.category ?? ''} className="input" placeholder="League, Trial, Clinic…" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="registrationUrl">Registration URL</label>
        <input id="registrationUrl" name="registrationUrl" defaultValue={initial?.registrationUrl ?? ''} className="input" placeholder="https://…" />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} className="h-4 w-4" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
          Active
        </label>
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
        <a href="/admin/events" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
