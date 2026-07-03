'use client';

type Data = {
  id?: string;
  name?: string;
  address?: string | null;
  mapUrl?: string;
  lat?: number | null;
  lng?: number | null;
  isPrimary?: boolean;
  order?: number;
  isActive?: boolean;
};

export function VenueForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: Data }) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">Venue name *</label>
        <input id="name" name="name" required defaultValue={initial?.name ?? ''} className="input" placeholder="e.g. Main Academy — Kollur" />
      </div>

      <div>
        <label className="label" htmlFor="mapUrl">Google Maps link *</label>
        <input
          id="mapUrl"
          name="mapUrl"
          required
          type="url"
          defaultValue={initial?.mapUrl ?? ''}
          className="input"
          placeholder="https://maps.app.goo.gl/…"
        />
        <p className="mt-1 text-xs text-silver-100/50">
          Paste the &quot;Share&quot; link from Google Maps. We&apos;ll automatically build the embedded map and fill the address on save.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="address">Address <span className="text-silver-100/40">(optional — auto-filled if blank)</span></label>
        <textarea id="address" name="address" rows={2} defaultValue={initial?.address ?? ''} className="input" placeholder="Leave blank to auto-detect from the map link" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="lat">Latitude <span className="text-silver-100/40">(optional)</span></label>
          <input id="lat" name="lat" defaultValue={initial?.lat ?? ''} className="input" placeholder="e.g. 17.4735" />
        </div>
        <div>
          <label className="label" htmlFor="lng">Longitude <span className="text-silver-100/40">(optional)</span></label>
          <input id="lng" name="lng" defaultValue={initial?.lng ?? ''} className="input" placeholder="e.g. 78.2934" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-silver-100/50">
        Coordinates sharpen the map pin &amp; local SEO. Tip: open the venue on Google Maps in a browser — the URL shows <code className="text-brand-400">@17.47…,78.29…</code>; paste those two numbers here. Auto-detected from full desktop links.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="order">Order</label>
          <input id="order" name="order" type="number" defaultValue={initial?.order ?? 0} className="input" />
        </div>
        <div className="flex items-end gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPrimary" defaultChecked={initial?.isPrimary ?? false} className="h-4 w-4" />
            Main location
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} className="h-4 w-4" />
            Active
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">Save</button>
        <a href="/nvx-panel-7q2/venues" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
