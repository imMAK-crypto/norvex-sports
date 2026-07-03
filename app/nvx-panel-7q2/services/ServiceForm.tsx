import { CmsImageInput } from '../_components/CmsImageInput';
import { Panel, PanelTitle, Field, ToggleField, NumberField, EditorHeader, EditorGrid, SidebarCard } from '../_components/ui';

type ServiceData = {
  id?: string;
  title?: string;
  slug?: string;
  shortDesc?: string;
  longDesc?: string;
  imageUrl?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

const ICONS = ['trophy', 'user', 'flame', 'shield', 'calendar', 'building', 'activity', 'target'];

export function ServiceForm({
  action,
  initial,
  crumb,
  title,
  viewHref,
}: {
  action: (fd: FormData) => Promise<void>;
  initial?: ServiceData;
  crumb: string;
  title: string;
  viewHref?: string;
}) {
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
      <EditorHeader crumb={crumb} title={title} viewHref={viewHref} cancelHref="/nvx-panel-7q2/services" />
      <EditorGrid
        main={
          <>
            <Panel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Title" name="title" defaultValue={initial?.title} required />
                <Field label="Slug" name="slug" defaultValue={initial?.slug} hint="auto if blank" placeholder="football-development-program" />
              </div>
              <Field label="Short description" name="shortDesc" defaultValue={initial?.shortDesc} required />
              <Field label="Long description" name="longDesc" defaultValue={initial?.longDesc} rows={8} required />
            </Panel>
            <Panel>
              <PanelTitle>Image</PanelTitle>
              <CmsImageInput name="imageUrl" altName="imageAlt" label="Service image" defaultValue={initial?.imageUrl} folder="norvex/services" hint="Cloudinary · drag & drop · recommended 1200×800" />
            </Panel>
          </>
        }
        sidebar={
          <>
            <SidebarCard title="Status">
              <ToggleField name="isActive" label="Active (visible on site)" defaultChecked={initial?.isActive ?? true} />
              <NumberField label="Order" name="order" defaultValue={initial?.order} />
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="cms-label">Icon</span>
                <select name="icon" defaultValue={initial?.icon ?? ''} className="cms-field">
                  <option value="">—</option>
                  {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
            </SidebarCard>
            <SidebarCard title="SEO">
              <Field label="Meta title" name="metaTitle" defaultValue={initial?.metaTitle} />
              <Field label="Meta description" name="metaDescription" defaultValue={initial?.metaDescription} rows={3} />
            </SidebarCard>
          </>
        }
      />
    </form>
  );
}
