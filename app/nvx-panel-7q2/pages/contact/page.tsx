import { getSettings, getSiteContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ContactPageEditor() {
  const [s, c] = await Promise.all([
    getSettings(['contact.eyebrow', 'contact.title', 'contact.intro', 'contact.responseTime']),
    getSiteContent(),
  ]);

  return (
    <CmsForm action={savePageSettings} gap={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
        <PageEditorHeader crumb="PAGES / CONTACT" title="Contact Page" subtitle="Header copy plus the contact details used across the whole site." viewHref="/contact" />

        <Panel>
          <PanelTitle hint="top of the page">Page header</PanelTitle>
          <Field label="Eyebrow" name="contact.eyebrow" defaultValue={s['contact.eyebrow']} />
          <Field label="Title" name="contact.title" defaultValue={s['contact.title']} />
          <Field label="Intro" name="contact.intro" defaultValue={s['contact.intro']} rows={2} />
          <Field label="Response time badge" name="contact.responseTime" defaultValue={s['contact.responseTime']} />
        </Panel>

        <Panel>
          <PanelTitle hint="used on every page, footer and WhatsApp button">Contact details</PanelTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Phone" name="contact.phone" defaultValue={c.contact.phone} />
            <Field label="Email" name="contact.email" defaultValue={c.contact.email} />
            <Field label="WhatsApp (digits + country code)" name="contact.whatsapp" defaultValue={c.contact.whatsapp} hint="e.g. 918089920562" />
            <Field label="Location" name="contact.location" defaultValue={c.contact.location} />
            <Field label="Careers email" name="contact.careersEmail" defaultValue={c.contact.careersEmail} />
          </div>
        </Panel>
      </div>
    </CmsForm>
  );
}
