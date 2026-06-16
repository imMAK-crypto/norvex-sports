'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createJob, updateJob, toggleJob, deleteJob } from '../actions';

export type Job = {
  id: string;
  title: string;
  type: string | null;
  location: string | null;
  description: string;
  applyUrl: string | null;
  isOpen: boolean;
};

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Volunteer'];

function JobFields({ job }: { job?: Job }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 1fr', gap: 10 }}>
        <input name="title" defaultValue={job?.title ?? ''} placeholder="Role title" className="cms-field" required />
        <select name="type" defaultValue={job?.type ?? ''} className="cms-field">
          <option value="">Type…</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="location" defaultValue={job?.location ?? ''} placeholder="Location (e.g. Hyderabad / Remote)" className="cms-field" />
      </div>
      <textarea name="description" defaultValue={job?.description ?? ''} placeholder="Short description of the role…" rows={3} className="cms-field" />
      <input name="applyUrl" defaultValue={job?.applyUrl ?? ''} placeholder="Apply link (optional — defaults to careers email)" className="cms-field mono" style={{ fontSize: 12 }} />
    </>
  );
}

export function JobsManager({ initial }: { initial: Job[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleCreate(fd: FormData) {
    const res = await createJob(fd);
    if (res.ok) { toast.success(res.message ?? 'Added'); setAdding(false); router.refresh(); }
    else toast.error(res.message ?? 'Failed');
  }
  async function handleUpdate(id: string, fd: FormData) {
    const res = await updateJob(id, fd);
    if (res.ok) { toast.success(res.message ?? 'Saved'); setEditingId(null); router.refresh(); }
    else toast.error(res.message ?? 'Failed');
  }
  async function handleToggle(id: string, isOpen: boolean) {
    const res = await toggleJob(id, isOpen);
    if (res.ok) { toast.success(res.message ?? 'Updated'); router.refresh(); }
    else toast.error(res.message ?? 'Failed');
  }
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete the role "${title}"? This cannot be undone.`)) return;
    const res = await deleteJob(id);
    if (res.ok) { toast.success(res.message ?? 'Deleted'); router.refresh(); }
    else toast.error(res.message ?? 'Failed');
  }

  return (
    <div className="cms-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>
          Open roles <span className="mono" style={{ fontSize: 11, color: 'var(--t5)', fontWeight: 400 }}>· {initial.length} total</span>
        </span>
        <button type="button" onClick={() => { setAdding((v) => !v); setEditingId(null); }} className="cms-btn cms-btn-primary" style={{ height: 34 }}>
          {adding ? 'Cancel' : '+ Add role'}
        </button>
      </div>

      {adding && (
        <form action={handleCreate} className="cms-pop" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, border: '1px dashed #3a3f45', borderRadius: 10 }}>
          <JobFields />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="cms-btn cms-btn-primary" style={{ height: 34 }}>Add role</button>
          </div>
        </form>
      )}

      {initial.length === 0 && !adding ? (
        <p style={{ padding: '18px 0', textAlign: 'center', color: 'var(--t4)', fontSize: 13 }}>No roles yet. Add one to show it on the Careers page.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {initial.map((job) =>
            editingId === job.id ? (
              <form key={job.id} action={(fd) => handleUpdate(job.id, fd)} className="cms-pop" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, border: '1px solid var(--line-2)', borderRadius: 10 }}>
                <JobFields job={job} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" onClick={() => setEditingId(null)} className="cms-btn cms-btn-ghost" style={{ height: 34 }}>Cancel</button>
                  <button type="submit" className="cms-btn cms-btn-primary" style={{ height: 34 }}>Save role</button>
                </div>
              </form>
            ) : (
              <div key={job.id} className="cms-rise" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line-2)', borderRadius: 10 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {job.title}
                    {job.type && <span style={{ fontSize: 10, color: 'var(--t3)', background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 20, padding: '2px 8px' }}>{job.type}</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--t5)', marginTop: 2 }}>{job.location ?? 'Location TBD'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(job.id, !job.isOpen)}
                  title={job.isOpen ? 'Open — click to close' : 'Closed — click to open'}
                  style={{ fontSize: 11, cursor: 'pointer', color: job.isOpen ? '#7fb98a' : 'var(--t3)', background: 'var(--panel-2)', border: '1px solid var(--line-2)', borderRadius: 20, padding: '5px 11px' }}
                >
                  {job.isOpen ? '● Open' : '○ Closed'}
                </button>
                <button type="button" onClick={() => { setEditingId(job.id); setAdding(false); }} title="Edit" className="cms-lift" style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, color: 'var(--t2)', background: 'none', cursor: 'pointer' }}>✎</button>
                <button type="button" onClick={() => handleDelete(job.id, job.title)} title="Delete" className="cms-lift" style={{ width: 30, height: 30, border: '1px solid var(--line-2)', borderRadius: 7, color: 'var(--t4)', background: 'none', cursor: 'pointer' }}>🗑</button>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
