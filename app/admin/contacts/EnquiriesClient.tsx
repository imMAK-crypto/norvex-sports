'use client';

import { useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { setLabel, saveNote, setRead, deleteEnquiry } from './actions';

export type Enquiry = {
  id: string;
  name: string;
  age: string | null;
  phone: string;
  email: string | null;
  program: string | null;
  message: string | null;
  isRead: boolean;
  label: string;
  note: string | null;
  createdAt: string;
};

const LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#c8ccd2', bg: 'rgba(200,204,210,.10)' },
  lead: { label: 'Lead', color: '#6fcf97', bg: 'rgba(111,207,151,.14)' },
  followup: { label: 'Follow-up', color: '#e0b341', bg: 'rgba(224,179,65,.14)' },
  scam: { label: 'Scam', color: '#e23b40', bg: 'rgba(226,59,64,.14)' },
  closed: { label: 'Closed', color: '#7c8088', bg: 'rgba(124,128,136,.12)' },
};

function fmt(d: string) {
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function EnquiriesClient({ initial }: { initial: Enquiry[] }) {
  const [rows, setRows] = useState<Enquiry[]>(initial);
  const [selId, setSelId] = useState<string | null>(initial[0]?.id ?? null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [note, setNote] = useState(initial[0]?.note ?? '');
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter === 'unread' && r.isRead) return false;
      if (q && !`${r.name} ${r.phone} ${r.email ?? ''} ${r.program ?? ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rows, q, filter]);

  const sel = rows.find((r) => r.id === selId) ?? filtered[0] ?? null;
  const unreadCount = rows.filter((r) => !r.isRead).length;

  function select(r: Enquiry) {
    setSelId(r.id);
    setNote(r.note ?? '');
    if (!r.isRead) {
      // auto-mark read on open
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, isRead: true } : x)));
      startTransition(() => { setRead(r.id, true); });
    }
  }

  function applyLabel(key: string) {
    if (!sel) return;
    setRows((prev) => prev.map((x) => (x.id === sel.id ? { ...x, label: key } : x)));
    startTransition(async () => {
      const res = await setLabel(sel.id, key);
      if (res?.ok === false) toast.error(res.message);
      else toast.success(res.message);
    });
  }

  function toggleRead() {
    if (!sel) return;
    const next = !sel.isRead;
    setRows((prev) => prev.map((x) => (x.id === sel.id ? { ...x, isRead: next } : x)));
    startTransition(async () => { await setRead(sel.id, next); });
    toast.success(next ? 'Marked as read' : 'Marked as unread');
  }

  function persistNote() {
    if (!sel) return;
    setRows((prev) => prev.map((x) => (x.id === sel.id ? { ...x, note } : x)));
    startTransition(async () => {
      const res = await saveNote(sel.id, note);
      if (res?.ok === false) toast.error(res.message);
      else toast.success(res.message);
    });
  }

  function remove() {
    if (!sel) return;
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    const id = sel.id;
    setRows((prev) => prev.filter((x) => x.id !== id));
    setSelId((prev) => (prev === id ? null : prev));
    startTransition(async () => {
      const res = await deleteEnquiry(id);
      if (res?.ok === false) toast.error(res.message);
      else toast.success(res.message);
    });
  }

  function exportCsv() {
    const head = ['Name', 'Age', 'Phone', 'Email', 'Program', 'Label', 'Read', 'Date', 'Message', 'Note'];
    const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head.join(',')].concat(
      rows.map((r) =>
        [r.name, r.age ?? '', r.phone, r.email ?? '', r.program ?? '', r.label, r.isRead ? 'yes' : 'no', fmt(r.createdAt), r.message ?? '', r.note ?? '']
          .map((x) => esc(String(x)))
          .join(','),
      ),
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `norvex-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const lm = sel ? LABELS[sel.label] ?? LABELS.new : LABELS.new;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>OVERVIEW / ENQUIRIES</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>Enquiries</span>
            {unreadCount > 0 && <span className="cms-badge">{unreadCount} unread</span>}
          </div>
          <span style={{ fontSize: 13, color: 'var(--t4)' }}>Contact form submissions · label · note · mark read · delete · export.</span>
        </div>
        <button onClick={exportCsv} className="cms-btn cms-btn-ghost">⤓ Export CSV</button>
      </div>

      {/* toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="⌕  Search name / phone / email…" className="cms-field" style={{ width: 260, height: 36 }} />
        <button onClick={() => setFilter('unread')} className="cms-btn" style={{ height: 36, border: '1px solid', borderColor: filter === 'unread' ? 'var(--accent)' : 'var(--line-2)', color: filter === 'unread' ? '#fff' : 'var(--t3)', background: filter === 'unread' ? 'var(--accent-soft)' : 'transparent' }}>Unread</button>
        <button onClick={() => setFilter('all')} className="cms-btn" style={{ height: 36, border: '1px solid', borderColor: filter === 'all' ? 'var(--accent)' : 'var(--line-2)', color: filter === 'all' ? '#fff' : 'var(--t3)', background: filter === 'all' ? 'var(--accent-soft)' : 'transparent' }}>All</button>
      </div>

      <div className="cms-grid-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 366px', gap: 18, alignItems: 'start' }}>
        {/* table */}
        <div className="cms-panel cms-rise" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="mono" style={{ display: 'grid', gridTemplateColumns: '18px 1fr 104px 92px', gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--line)', fontSize: 10, letterSpacing: '.08em', color: 'var(--t4)' }}>
            <span /><span>NAME</span><span>LABEL</span><span>DATE</span>
          </div>
          {filtered.length === 0 ? (
            <p style={{ padding: 28, textAlign: 'center', color: 'var(--t4)', fontSize: 13 }}>No enquiries match.</p>
          ) : (
            filtered.map((e) => {
              const l = LABELS[e.label] ?? LABELS.new;
              const isSel = sel?.id === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => select(e)}
                  style={{
                    display: 'grid', gridTemplateColumns: '18px 1fr 104px 92px', gap: 12, alignItems: 'center',
                    padding: '13px 16px', borderBottom: '1px solid #1e2125', cursor: 'pointer',
                    borderLeft: `3px solid ${isSel ? 'var(--accent)' : 'transparent'}`,
                    background: isSel ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.isRead ? '#3a3f45' : 'var(--accent)' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: isSel ? '#fff' : e.isRead ? 'var(--t2)' : 'var(--t1)' }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--t4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.program ?? 'General enquiry'}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: l.color, background: l.bg, borderRadius: 20, padding: '4px 10px', justifySelf: 'start' }}>{l.label}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>{fmt(e.createdAt)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* detail / triage */}
        <div className="cms-panel cms-slide-in" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 15, position: 'sticky', top: 80 }}>
          {!sel ? (
            <p style={{ color: 'var(--t4)', fontSize: 13, textAlign: 'center', padding: 20 }}>Select an enquiry to triage.</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: sel.isRead ? '#3a3f45' : 'var(--accent)' }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', flex: 1 }}>{sel.name}</span>
                <span className="mono" style={{ fontSize: 11, color: lm.color, background: lm.bg, borderRadius: 20, padding: '4px 11px' }}>{lm.label}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t5)', marginBottom: 5 }}>Form submission</span>
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                  {[
                    ['Age', sel.age ?? '—'],
                    ['Phone', sel.phone],
                    ['Email', sel.email ?? '—'],
                    ['Program', sel.program ?? '—'],
                    ['Submitted', fmt(sel.createdAt)],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 12px', background: 'var(--panel-2)', borderBottom: '1px solid var(--line)' }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{k}</span>
                      <span style={{ fontSize: 12, color: 'var(--t2)', textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {sel.message && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t5)' }}>Message</span>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--panel-2)', padding: '11px 12px', fontSize: 12, color: 'var(--t3)', lineHeight: 1.55 }}>{sel.message}</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t5)' }}>Label this enquiry</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {Object.entries(LABELS).map(([k, m]) => {
                    const on = sel.label === k;
                    return (
                      <button key={k} onClick={() => applyLabel(k)} className="cms-lift" style={{ height: 30, padding: '0 13px', borderRadius: 8, border: `1px solid ${on ? m.color : 'var(--line-2)'}`, background: on ? m.bg : 'transparent', color: on ? m.color : 'var(--t4)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t5)' }}>Internal note</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={persistNote} rows={3} placeholder="Why it's a lead / who's following up…" className="cms-field" />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={toggleRead} className="cms-btn cms-btn-ghost" style={{ flex: 1 }}>{sel.isRead ? 'Mark unread' : 'Mark as read'}</button>
                <button onClick={remove} className="cms-btn cms-btn-danger">Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
