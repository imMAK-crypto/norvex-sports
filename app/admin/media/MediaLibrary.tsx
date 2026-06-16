'use client';

import { useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteAsset, updateAssetAlt } from './actions';

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  folder: string | null;
  createdAt: string;
};

function fmtBytes(b: number | null): string {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });

export function MediaLibrary({ initial, cloudinaryReady }: { initial: MediaItem[]; cloudinaryReady: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(() => initial.reduce((s, m) => s + (m.bytes ?? 0), 0), [initial]);
  const filtered = useMemo(
    () =>
      initial.filter((m) =>
        q ? `${m.filename} ${m.alt ?? ''} ${m.folder ?? ''}`.toLowerCase().includes(q.toLowerCase()) : true,
      ),
    [initial, q],
  );

  async function uploadFiles(files: FileList | File[]) {
    if (!cloudinaryReady) {
      toast.error('Cloudinary not configured — set CLOUDINARY_* env vars to upload.');
      return;
    }
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    let done = 0;
    for (const file of arr) {
      const fd = new FormData();
      fd.set('file', file);
      fd.set('folder', 'norvex/library');
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'upload failed');
        done++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Upload failed');
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    if (done) {
      toast.success(`${done} file${done > 1 ? 's' : ''} uploaded`);
      router.refresh();
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied');
    } catch {
      toast.error('Could not copy');
    }
  }

  async function remove(m: MediaItem) {
    if (!confirm(`Delete "${m.filename}"? This removes it from Cloudinary too and cannot be undone.`)) return;
    const res = await deleteAsset(m.id);
    if (res.ok) {
      toast.success(res.message ?? 'Deleted');
      setPreview(null);
      router.refresh();
    } else {
      toast.error(res.message ?? 'Failed');
    }
  }

  async function saveAlt(id: string, alt: string) {
    const res = await updateAssetAlt(id, alt);
    if (res.ok) toast.success(res.message ?? 'Saved');
    else toast.error(res.message ?? 'Failed');
    setEditing(null);
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1180 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>LIBRARY / MEDIA</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>Media Library</span>
          <span style={{ fontSize: 13, color: 'var(--t4)' }}>
            {initial.length} asset{initial.length === 1 ? '' : 's'} · {fmtBytes(totalBytes)} stored
          </span>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="cms-btn cms-btn-primary">
          {uploading ? 'Uploading…' : '⤓ Upload media'}
        </button>
      </div>

      {/* dropzone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        className="cms-lift"
        style={{
          borderRadius: 14, cursor: 'pointer', padding: '26px 20px', textAlign: 'center',
          border: `1.5px dashed ${dragOver ? 'var(--accent)' : '#3a3f45'}`,
          background: dragOver ? 'var(--accent-soft)' : 'repeating-linear-gradient(45deg,rgba(255,255,255,.012) 0 12px,rgba(255,255,255,.03) 12px 24px)',
          transition: 'border-color .15s, background .15s',
        }}
      >
        <div style={{ fontSize: 26, marginBottom: 6 }}>☁</div>
        <div style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 600 }}>
          {uploading ? 'Uploading…' : 'Drop images here or click to upload'}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--t5)', marginTop: 4 }}>
          {cloudinaryReady ? 'JPG · PNG · WEBP · max 10MB — multiple files supported' : 'Cloudinary not configured — uploads disabled'}
        </div>
      </div>

      {/* search */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="⌕  Search by filename, alt text, or folder…"
        className="cms-field"
        style={{ maxWidth: 360, height: 38 }}
      />

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="cms-panel cms-rise" style={{ padding: 40, textAlign: 'center', color: 'var(--t4)', fontSize: 13 }}>
          {initial.length === 0 ? 'No media yet — upload your first asset above.' : 'No assets match your search.'}
        </div>
      ) : (
        <div className="cms-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
          {filtered.map((m, i) => (
            <div
              key={m.id}
              className="cms-panel cms-lift"
              style={{ ['--i' as string]: Math.min(i, 12), padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <button
                type="button"
                onClick={() => setPreview(m)}
                style={{ border: 'none', padding: 0, cursor: 'zoom-in', background: '#000', height: 130, display: 'block' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.filename}>
                  {m.filename}
                </span>
                <div className="mono" style={{ fontSize: 10, color: 'var(--t5)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span>{m.width && m.height ? `${m.width}×${m.height}` : (m.format ?? 'img')}</span>
                  <span>·</span>
                  <span>{fmtBytes(m.bytes)}</span>
                  <span>·</span>
                  <span>{fmtDate(m.createdAt)}</span>
                </div>
                {editing === m.id ? (
                  <input
                    autoFocus
                    defaultValue={m.alt ?? ''}
                    placeholder="Alt text…"
                    className="cms-field"
                    style={{ height: 30, fontSize: 12 }}
                    onBlur={(e) => saveAlt(m.id, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditing(null); }}
                  />
                ) : (
                  <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <button type="button" onClick={() => copy(m.url)} title="Copy URL" className="cms-btn cms-btn-ghost" style={{ height: 28, flex: 1, padding: '0 8px', fontSize: 11 }}>⧉ Copy</button>
                    <button type="button" onClick={() => setEditing(m.id)} title="Edit alt text" className="cms-btn cms-btn-ghost" style={{ height: 28, padding: '0 9px', fontSize: 11 }}>✎</button>
                    <button type="button" onClick={() => remove(m)} title="Delete" className="cms-btn cms-btn-danger" style={{ height: 28, padding: '0 9px', fontSize: 11 }}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); }} />

      {/* lightbox */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(8,9,10,.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div className="cms-panel cms-pop" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760, width: '100%', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ borderRadius: 10, overflow: 'hidden', background: '#000', maxHeight: '62vh', display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.alt ?? preview.filename} style={{ maxWidth: '100%', maxHeight: '62vh', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview.filename}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>
                  {preview.width && preview.height ? `${preview.width}×${preview.height} · ` : ''}{fmtBytes(preview.bytes)} · {preview.folder ?? 'norvex'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => copy(preview.url)} className="cms-btn cms-btn-primary" style={{ height: 34 }}>⧉ Copy URL</button>
                <a href={preview.url} target="_blank" rel="noreferrer" className="cms-btn cms-btn-ghost" style={{ height: 34 }}>Open ↗</a>
                <button type="button" onClick={() => remove(preview)} className="cms-btn cms-btn-danger" style={{ height: 34 }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
