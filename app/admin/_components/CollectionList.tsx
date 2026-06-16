'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type Row = {
  id: string;
  title: string;
  slug?: string | null;
  date?: string | null;
  category?: string | null;
  featured?: boolean;
  active: boolean;
  imageUrl?: string | null;
};

export function CollectionList({
  crumb,
  title,
  singular,
  newHref,
  basePath,
  viewBase,
  rows,
  deleteAction,
  showFeatured = false,
  showDate = false,
  showCategory = false,
}: {
  crumb: string;
  title: string;
  singular: string;
  newHref: string;
  basePath: string;
  viewBase?: string;
  rows: Row[];
  deleteAction: (fd: FormData) => Promise<void>;
  showFeatured?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
}) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'hidden'>('all');

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (status === 'active' && !r.active) return false;
        if (status === 'hidden' && r.active) return false;
        if (q && !`${r.title} ${r.slug ?? ''} ${r.category ?? ''}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [rows, q, status],
  );

  const cols = `24px 58px minmax(0,1fr)${showDate ? ' 110px' : ''}${showCategory ? ' 120px' : ''}${showFeatured ? ' 56px' : ''} 92px 116px`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{crumb}</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>{title}</span>
          <span style={{ fontSize: 13, color: 'var(--t4)' }}>{rows.length} {rows.length === 1 ? singular.toLowerCase() : `${singular.toLowerCase()}s`} · click ✎ to edit.</span>
        </div>
        <Link href={newHref} className="cms-btn cms-btn-primary">+ New {singular.toLowerCase()}</Link>
      </div>

      {/* toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`⌕  Search ${title.toLowerCase()}…`} className="cms-field" style={{ width: 260, height: 36 }} />
        {(['all', 'active', 'hidden'] as const).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className="cms-btn" style={{ height: 36, textTransform: 'capitalize', border: '1px solid', borderColor: status === s ? 'var(--accent)' : 'var(--line-2)', color: status === s ? '#fff' : 'var(--t3)', background: status === s ? 'var(--accent-soft)' : 'transparent' }}>{s}</button>
        ))}
      </div>

      {/* table */}
      <div className="cms-panel cms-rise" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="mono" style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--line)', fontSize: 10, letterSpacing: '.08em', color: 'var(--t4)' }}>
          <span /><span>IMG</span><span>TITLE</span>
          {showDate && <span>DATE</span>}
          {showCategory && <span>CATEGORY</span>}
          {showFeatured && <span>FEAT</span>}
          <span>STATUS</span>
          <span style={{ textAlign: 'right' }}>ACTIONS</span>
        </div>
        {filtered.length === 0 ? (
          <p style={{ padding: 28, textAlign: 'center', color: 'var(--t4)', fontSize: 13 }}>No {title.toLowerCase()} found.</p>
        ) : (
          filtered.map((r) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid #1e2125' }}>
              <span style={{ color: 'var(--t5)', cursor: 'grab' }}>⠿</span>
              <div style={{ width: 50, height: 36, borderRadius: 6, border: '1px solid var(--line-2)', overflow: 'hidden', background: 'repeating-linear-gradient(45deg,rgba(255,255,255,.015) 0 7px,rgba(255,255,255,.04) 7px 14px)' }}>
                {r.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                {r.slug != null && <div className="mono" style={{ fontSize: 11, color: 'var(--t5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/{r.slug}</div>}
              </div>
              {showDate && <span className="mono" style={{ fontSize: 12, color: 'var(--t3)' }}>{r.date ?? '—'}</span>}
              {showCategory && <span style={{ fontSize: 11, color: 'var(--t3)', background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 20, padding: '4px 10px', justifySelf: 'start' }}>{r.category ?? '—'}</span>}
              {showFeatured && <span style={{ color: r.featured ? 'var(--accent)' : '#33363b', fontSize: 14 }}>★</span>}
              <span style={{ fontSize: 11, color: r.active ? '#7fb98a' : 'var(--t3)', background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 20, padding: '4px 10px', justifySelf: 'start' }}>{r.active ? 'Published' : 'Hidden'}</span>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Link href={`${basePath}/${r.id}`} title="Edit" className="cms-lift" style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', fontSize: 11 }}>✎</Link>
                {viewBase && r.slug && (
                  <Link href={`${viewBase}/${r.slug}`} target="_blank" title="View" className="cms-lift" style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 11 }}>↗</Link>
                )}
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" title="Delete" className="cms-lift" onClick={(e) => { if (!confirm('Delete this item? This cannot be undone.')) e.preventDefault(); }} style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t4)', fontSize: 11, cursor: 'pointer', background: 'none' }}>🗑</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
