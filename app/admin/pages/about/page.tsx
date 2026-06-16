import { getSettings, getSiteContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { CmsImageInput } from '../../_components/CmsImageInput';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AboutPageEditor() {
  const [s, c] = await Promise.all([
    getSettings(['about.eyebrow', 'about.title', 'about.intro', 'about.image']),
    getSiteContent(),
  ]);

  return (
    <CmsForm action={savePageSettings} gap={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
        <PageEditorHeader crumb="PAGES / ABOUT" title="About Page" subtitle="The Norvex story, header and imagery." viewHref="/about" />

        <Panel>
          <PanelTitle hint="top of the page">Page header</PanelTitle>
          <Field label="Eyebrow" name="about.eyebrow" defaultValue={s['about.eyebrow']} />
          <Field label="Title" name="about.title" defaultValue={s['about.title']} />
          <Field label="Intro" name="about.intro" defaultValue={s['about.intro']} rows={2} />
        </Panel>

        <Panel>
          <PanelTitle hint="main body — paragraphs separated by a blank line">Our story</PanelTitle>
          <Field label="About — short (homepage / footer)" name="site.aboutShort" defaultValue={c.aboutShort} rows={3} />
          <Field label="About — long (about page body)" name="site.aboutLong" defaultValue={c.aboutLong} rows={12} />
        </Panel>

        <Panel>
          <PanelTitle>Image</PanelTitle>
          <CmsImageInput name="about.image" label="About page image" defaultValue={s['about.image']} folder="norvex/about" hint="recommended 1200×900, 4:3" width={240} height={160} />
        </Panel>
      </div>
    </CmsForm>
  );
}
