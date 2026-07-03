'use client';

import { useMemo, useState } from 'react';

type Data = {
  id?: string;
  name?: string;
  address?: string | null;
  mapUrl?: string;
  embedUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  isPrimary?: boolean;
  order?: number;
  isActive?: boolean;
};

/** Key-free Google Maps embed for a free-text query or "lat,lng" pair. */
function embedFor(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=16`;
}

/**
 * Venue editor with a live map preview so placement can be verified before
 * saving. Preview source priority: exact coordinates → typed address → the
 * already-saved embed (edit mode). The authoritative embed is still built
 * server-side from the Google Maps share link on save (see actions.ts).
 */
export function VenueForm({ action, initial }: { action: (fd: FormData) => Promise<void>; initial?: Data }) {
  const [address, setAddress] = useState(initial?.address ?? '');
  const [lat, setLat] = useState(initial?.lat != null ? String(initial.lat) : '');
  const [lng, setLng] = useState(initial?.lng != null ? String(initial.lng) : '');

  // Pasting a whole "17.4983, 78.3443" pair into either field fills both.
  const onCoord = (value: string, which: 'lat' | 'lng') => {
    const pair = value.match(/(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
    if (pair) {
      setLat(pair[1]);
      setLng(pair[2]);
      return;
    }
    (which === 'lat' ? setLat : setLng)(value);
  };

  const previewSrc = useMemo(() => {
    const la = Number(lat), ln = Number(lng);
    if (lat && lng && Number.isFinite(la) && Number.isFinite(ln) && Math.abs(la) <= 90 && Math.abs(ln) <= 180) {
      return embedFor(`${la},${ln}`);
    }
    if (address.trim().length > 5) return embedFor(address.trim());
    return initial?.embedUrl ?? null;
  }, [lat, lng, address, initial?.embedUrl]);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">Venue name *</label>
        <input id="name" name="name" required defaultValue={initial?.name ?? ''} className="input" placeholder="e.g. Norvex Sports Academy — Madinaguda" />
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
          Paste the &quot;Share&quot; link from Google Maps. The embedded map, address and pin are built from it automatically on save.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="address">Address <span className="text-silver-100/40">(optional — auto-filled if blank)</span></label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
          placeholder="Leave blank to auto-detect from the map link"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="lat">Latitude <span className="text-silver-100/40">(optional)</span></label>
          <input id="lat" name="lat" value={lat} onChange={(e) => onCoord(e.target.value, 'lat')} className="input" placeholder="e.g. 17.4983 — or paste “17.4983, 78.3443”" />
        </div>
        <div>
          <label className="label" htmlFor="lng">Longitude <span className="text-silver-100/40">(optional)</span></label>
          <input id="lng" name="lng" value={lng} onChange={(e) => onCoord(e.target.value, 'lng')} className="input" placeholder="e.g. 78.3443" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-silver-100/50">
        Coordinates give the sharpest pin (and best local SEO). On Google Maps: right-click the exact spot → the first
        menu row shows the numbers — click to copy, then paste the pair into either box above.
      </p>

      {/* Live placement preview — updates as coordinates / address change */}
      <div>
        <span className="label">Map placement preview</span>
        {previewSrc ? (
          <div className="overflow-hidden rounded-lg border border-ink-500">
            <iframe
              title="Venue map preview"
              src={previewSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full"
            />
          </div>
        ) : (
          <div className="grid h-32 place-items-center rounded-lg border border-dashed border-ink-500 text-xs text-silver-100/40">
            Enter coordinates or an address to preview the pin position
          </div>
        )}
        <p className="mt-1 text-xs text-silver-100/50">
          Check the pin lands on the right spot. If it&apos;s off, paste exact coordinates — they always win over the
          auto-detected position. The final public map is rebuilt from the share link + these fields when you save.
        </p>
      </div>

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
