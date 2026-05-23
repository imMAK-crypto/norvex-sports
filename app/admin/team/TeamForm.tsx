'use client';

import { ImageInput } from '../_components/ImageInput';

type Data = {
  id?: string;
  name?: string;
  role?: string;
  bio?: string | null;
  qualifications?: string | null;
  experience?: string | null;
  imageUrl?: string | null;
  order?: number;
  isActive?: boolean;
};

export function TeamForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: Data }) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" name="name" required defaultValue={initial?.name ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="role">Role *</label>
          <input id="role" name="role" required defaultValue={initial?.role ?? ''} className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" rows={5} defaultValue={initial?.bio ?? ''} className="input" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="qualifications">Qualifications</label>
          <input id="qualifications" name="qualifications" defaultValue={initial?.qualifications ?? ''} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="experience">Experience</label>
          <input id="experience" name="experience" defaultValue={initial?.experience ?? ''} className="input" />
        </div>
      </div>

      <ImageInput name="imageUrl" defaultValue={initial?.imageUrl ?? ''} folder="norvex/team" label="Photo" />

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
        <a href="/admin/team" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
