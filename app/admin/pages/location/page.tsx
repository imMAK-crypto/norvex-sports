import { getSettings, getSiteContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LocationPageEditor() {
  const [s, c] = await Promise.all([
    getSettings([
      'location.eyebrow', 'location.title', 'location.intro',
      'location.mapEmbed', 'location.outroTitle', 'location.outro',
    ]),
    getSiteContent(),
  ]);

  return (
    <CmsForm action={savePageSettings} gap={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
        <PageEditorHeader crumb="PAGES / LOCATION" title="Location Page" subtitle="Address, embedded map and expansion note." viewHref="/location" />

        <Panel>
          <PanelTitle hint="top of the page">Page header</PanelTitle>
          <Field label="Eyebrow" name="location.eyebrow" defaultValue={s['location.eyebrow']} />
          <Field label="Title" name="location.title" defaultValue={s['location.title']} />
          <Field label="Intro" name="location.intro" defaultValue={s['location.intro']} rows={2} />
        </Panel>

        <Panel>
          <PanelTitle hint="address is shared with the Contact editor">Map &amp; address</PanelTitle>
          <Field label="Location / address" name="contact.location" defaultValue={c.contact.location} />
          <Field
            label="Google Maps embed URL"
            name="location.mapEmbed"
            defaultValue={s['location.mapEmbed']}
            hint="Maps → Share → Embed a map → copy the src=… URL"
          />
        </Panel>

        <Panel>
          <PanelTitle hint="the closing band">“Expanding outward” section</PanelTitle>
          <Field label="Title" name="location.outroTitle" defaultValue={s['location.outroTitle']} />
          <Field label="Text" name="location.outro" defaultValue={s['location.outro']} rows={3} />
        </Panel>
      </div>
    </CmsForm>
  );
}
