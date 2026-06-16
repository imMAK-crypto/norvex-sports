'use client';

import { useRef, useState } from 'react';

export function CmsImageInput({
  name,
  altName,
  label = 'Image',
  defaultValue,
  defaultAlt,
  folder = 'norvex',
  hint,
  height = 118,
  width = 200,
}: {
  name: string;
  altName?: string;
  label?: string;
  defaultValue?: string | null;
  defaultAlt?: string | null;
  folder?: string;
  hint?: string;
  height?: number;
  width?: number;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="cms-label">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="cms-lift"
          style={{
            width, height, borderRadius: 9, flex: 'none', cursor: 'pointer', overflow: 'hidden',
            border: url ? '1px solid var(--line-3)' : '1.5px dashed #3a3f45',
            background: url ? '#000' : 'repeating-linear-gradient(45deg,rgba(255,255,255,.015) 0 10px,rgba(255,255,255,.045) 10px 20px)',
            display: 'flex', alignItems: url ? 'stretch' : 'center', justifyContent: 'center',
          }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span className="mono" style={{ fontSize: 11, color: 'var(--t4)', textAlign: 'center', padding: 8 }}>
              {uploading ? 'UPLOADING…' : 'DROP OR CLICK TO UPLOAD'}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => fileRef.current?.click()} className="cms-btn cms-btn-primary" style={{ height: 34 }}>
              {uploading ? 'Uploading…' : '⤓ Replace image'}
            </button>
            {url && (
              <button type="button" onClick={() => setUrl('')} className="cms-btn cms-btn-ghost" style={{ height: 34 }}>
                Remove
              </button>
            )}
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="cms-label">Or paste URL</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="cms-field mono" style={{ fontSize: 12 }} />
          </label>
          {altName && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="cms-label">Alt text</span>
              <input name={altName} defaultValue={defaultAlt ?? ''} placeholder="Describe the image" className="cms-field" style={{ height: 34 }} />
            </label>
          )}
          {hint && <span className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>{hint}</span>}
          {error && <span style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</span>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
}
