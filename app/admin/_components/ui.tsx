import Link from 'next/link';
import { ReactNode } from 'react';
import { SubmitButton, DeleteSubmit } from './CmsForm';

/** Page title block — breadcrumb eyebrow + title + optional subtitle + right-side actions. */
export function PageHead({
  crumb,
  title,
  subtitle,
  actions,
  badge,
}: {
  crumb: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{crumb}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>{title}</span>
          {badge}
        </div>
        {subtitle && <span style={{ fontSize: 13, color: 'var(--t4)' }}>{subtitle}</span>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

/** A content panel/card. Pass `i` to participate in the staggered rise animation. */
export function Panel({
  children,
  className = '',
  style,
  i,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  i?: number;
}) {
  return (
    <div
      className={`cms-panel ${i != null ? '' : 'cms-rise'} ${className}`}
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, ...(i != null ? { ['--i' as string]: i } : {}), ...style }}
    >
      {children}
    </div>
  );
}

export function PanelTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>
      {children}
      {hint && <span className="mono" style={{ fontSize: 11, color: 'var(--t5)', marginLeft: 8, fontWeight: 400 }}>· {hint}</span>}
    </span>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = 'text',
  rows,
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="cms-label">
        {label}
        {hint && <span style={{ textTransform: 'none', color: 'var(--t5)' }}> · {hint}</span>}
      </span>
      {rows ? (
        <textarea name={name} defaultValue={defaultValue ?? ''} rows={rows} placeholder={placeholder} className="cms-field" required={required} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ''} type={type} placeholder={placeholder} className="cms-field" required={required} />
      )}
    </label>
  );
}

/** Server toggle backed by a checkbox (name + defaultChecked). Styled as the wireframe pill switch. */
export function ToggleField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--t3)' }}>{label}</span>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer" style={{ position: 'absolute', opacity: 0, width: 40, height: 22, margin: 0, cursor: 'pointer', zIndex: 1 }} />
        <span aria-hidden style={{ width: 40, height: 22, borderRadius: 11, background: '#3a3f45', position: 'relative', transition: 'background .2s', display: 'inline-block' }}>
          <span style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: '#9a9fa6', transition: 'transform .2s, background .2s' }} />
        </span>
      </span>
    </label>
  );
}

export function LinkBtn({
  href,
  children,
  variant = 'ghost',
  target,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  target?: string;
}) {
  return (
    <Link href={href} target={target} className={`cms-btn cms-btn-${variant}`}>
      {children}
    </Link>
  );
}

export function StatusPill({ on, onText = 'Published', offText = 'Draft' }: { on: boolean; onText?: string; offText?: string }) {
  return (
    <span
      style={{
        fontSize: 11, color: on ? '#7fb98a' : 'var(--t3)', background: 'var(--panel-2)',
        border: '1px solid var(--line-2)', borderRadius: 20, padding: '4px 10px',
      }}
    >
      {on ? onText : offText}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p style={{ padding: 28, textAlign: 'center', color: 'var(--t4)', fontSize: 13 }}>{children}</p>;
}

/** Editor header — breadcrumb + title + "View on site" + Save (inside the form). */
export function EditorHeader({ crumb, title, viewHref, cancelHref }: { crumb: string; title: string; viewHref?: string; cancelHref?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{crumb}</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {cancelHref && <Link href={cancelHref} className="cms-btn cms-btn-ghost">Cancel</Link>}
        {viewHref && <Link href={viewHref} target="_blank" className="cms-btn cms-btn-ghost">View on site ↗</Link>}
        <SubmitButton>Save</SubmitButton>
      </div>
    </div>
  );
}

/** Sticky header for the Page editors — breadcrumb + title + "View on site" + Save.
 *  Render it as the first child of a <CmsForm> so the Save button submits the form. */
export function PageEditorHeader({
  crumb,
  title,
  subtitle,
  viewHref,
}: {
  crumb: string;
  title: string;
  subtitle?: string;
  viewHref?: string;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        position: 'sticky', top: 0, zIndex: 5, paddingBottom: 4,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--t4)' }}>{crumb}</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--t1)' }}>{title}</span>
        {subtitle && <span style={{ fontSize: 13, color: 'var(--t4)' }}>{subtitle}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {viewHref && <Link href={viewHref} target="_blank" className="cms-btn cms-btn-ghost">View on site ↗</Link>}
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </div>
  );
}

export function SidebarCard({ title, children, accent }: { title: string; children: ReactNode; accent?: boolean }) {
  return (
    <div className="cms-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 13, borderColor: accent ? '#3a2326' : 'var(--line-2)' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--t1)' }}>{title}</span>
      {children}
    </div>
  );
}

/** The 2-column editor body: main content + sticky sidebar. */
export function EditorGrid({ main, sidebar }: { main: ReactNode; sidebar: ReactNode }) {
  return (
    <div className="cms-grid-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 18, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{main}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>{sidebar}</div>
    </div>
  );
}

/** Standalone delete form — rendered as its own <form> (forms can't nest). */
export function DangerZone({ deleteAction, id, singular }: { deleteAction: (fd: FormData) => Promise<void>; id: string; singular: string }) {
  return (
    <div className="cms-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 11, borderColor: '#3a2326', maxWidth: 420 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Danger zone</span>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <DeleteSubmit singular={singular} />
      </form>
    </div>
  );
}

export function NumberField({ label, name, defaultValue }: { label: string; name: string; defaultValue?: number }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--t3)' }}>{label}</span>
      <input type="number" name={name} defaultValue={defaultValue ?? 0} className="cms-field" style={{ width: 80, height: 30, padding: '0 10px' }} />
    </label>
  );
}
