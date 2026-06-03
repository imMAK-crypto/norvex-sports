'use client';

import { ImageInput } from '../_components/ImageInput';

type ServiceData = {
  id?: string;
  title?: string;
  slug?: string;
  shortDesc?: string;
  longDesc?: string;
  imageUrl?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

const ICONS = ['trophy', 'user', 'flame', 'shield', 'calendar', 'building', 'activity', 'target'];

export function ServiceForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: ServiceData }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" required defaultValue={initial?.title ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug (auto if blank)</label>
          <input id="slug" name="slug" defaultValue={initial?.slug ?? ''} className="input" placeholder="football-development-program" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="shortDesc">Short description *</label>
        <input id="shortDesc" name="shortDesc" required defaultValue={initial?.shortDesc ?? ''} className="input" />
      </div>

      <div>
        <label className="label" htmlFor="longDesc">Long description *</label>
        <textarea id="longDesc" name="longDesc" rows={8} required defaultValue={initial?.longDesc ?? ''} className="input" />
      </div>

      <ImageInput name="imageUrl" defaultValue={initial?.imageUrl ?? ''} folder="norvex/services" />

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="icon">Icon</label>
          <select id="icon" name="icon" defaultValue={initial?.icon ?? ''} className="input">
            <option value="">—</option>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="order">Order</label>
          <input id="order" name="order" type="number" defaultValue={initial?.order ?? 0} className="input" />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
            Active (visible on site)
          </label>
        </div>
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
        <a href="/admin/services" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
