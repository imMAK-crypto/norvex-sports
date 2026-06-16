import { prisma, safeQuery } from '@/lib/prisma';
import { getSettings, getSiteContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';
import { JobsManager, type Job } from './JobsManager';

export const dynamic = 'force-dynamic';

export default async function CareersPageEditor() {
  const [s, c, jobs] = await Promise.all([
    getSettings(['careers.eyebrow', 'careers.title', 'careers.intro', 'careers.body']),
    getSiteContent(),
    safeQuery(() => prisma.jobPosting.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }), []),
  ]);

  const jobItems: Job[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    type: j.type,
    location: j.location,
    description: j.description,
    applyUrl: j.applyUrl,
    isOpen: j.isOpen,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
      <CmsForm action={savePageSettings} gap={18}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <PageEditorHeader crumb="PAGES / CAREERS" title="Careers Page" subtitle="Header, intro copy and open roles." viewHref="/careers" />

          <Panel>
            <PanelTitle hint="top of the page">Page header</PanelTitle>
            <Field label="Eyebrow" name="careers.eyebrow" defaultValue={s['careers.eyebrow']} />
            <Field label="Title" name="careers.title" defaultValue={s['careers.title']} />
            <Field label="Intro" name="careers.intro" defaultValue={s['careers.intro']} rows={2} />
          </Panel>

          <Panel>
            <PanelTitle>Body &amp; application email</PanelTitle>
            <Field label="Intro paragraph" name="careers.body" defaultValue={s['careers.body']} rows={4} />
            <Field label="Careers / applications email" name="contact.careersEmail" defaultValue={c.contact.careersEmail} />
          </Panel>
        </div>
      </CmsForm>

      <JobsManager initial={jobItems} />
    </div>
  );
}
