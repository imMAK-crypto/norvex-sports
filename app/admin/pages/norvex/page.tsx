import { getSettings, getSiteContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NorvexProjectEditor() {
  const [s, c] = await Promise.all([
    getSettings(['norvex.eyebrow', 'norvex.title', 'norvex.intro']),
    getSiteContent(),
  ]);

  return (
    <CmsForm action={savePageSettings} gap={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
        <PageEditorHeader crumb="PAGES / THE NORVEX PROJECT" title="The Norvex Project" subtitle="Vision statement and page header." viewHref="/the-norvex-project" />

        <Panel>
          <PanelTitle hint="top of the page">Page header</PanelTitle>
          <Field label="Eyebrow" name="norvex.eyebrow" defaultValue={s['norvex.eyebrow']} />
          <Field label="Title" name="norvex.title" defaultValue={s['norvex.title']} />
          <Field label="Intro" name="norvex.intro" defaultValue={s['norvex.intro']} rows={2} />
        </Panel>

        <Panel>
          <PanelTitle hint="shown on the home page and this page">Vision statement</PanelTitle>
          <Field label="The Norvex Project statement" name="site.projectStatement" defaultValue={c.projectStatement} rows={8} />
        </Panel>
      </div>
    </CmsForm>
  );
}
