'use client';

import { useRef, useState } from 'react';

export function ImageInput({
  name,
  defaultValue,
  folder = 'norvex',
  label = 'Image',
}: {
  name: string;
  defaultValue?: string | null;
  folder?: string;
  label?: string;
}) {
  const [url, setUrl] = useState<string>(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('folder', folder);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'upload failed');
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-3">
        {url && (
          <div className="relative inline-block">
            <img src={url} alt="" className="max-h-40 rounded-lg border border-white/10" />
          </div>
        )}
        <input
          type="url"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… or upload below"
          className="input"
        />
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="text-xs text-white/60 file:mr-2 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-black" />
          {uploading && <span className="text-xs text-white/60">Uploading…</span>}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
