'use client';

import { ImageInput } from '../_components/ImageInput';

type Data = {
  id?: string;
  title?: string;
  caption?: string | null;
  imageUrl?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
};

const CATEGORIES = [
  'General',
  'Academy Training',
  'Match Day',
  'Events & Tournaments',
  'Team Photos',
  'Player Highlights',
  'Facilities',
  'Celebrations',
  'Coaches',
  'Kids Training',
];

export function GalleryForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: Data }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" required defaultValue={initial?.title ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={initial?.category ?? 'General'} className="input">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="caption">Caption</label>
        <input id="caption" name="caption" defaultValue={initial?.caption ?? ''} className="input" />
      </div>

      <ImageInput name="imageUrl" defaultValue={initial?.imageUrl ?? ''} folder="norvex/gallery" label="Image *" />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="order">Order</label>
          <input id="order" name="order" type="number" defaultValue={initial?.order ?? 0} className="input" />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
            Active
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">Save</button>
        <a href="/admin/gallery" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
