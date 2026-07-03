import { getHomeContent } from '@/lib/settings';
import { CmsForm } from '../../_components/CmsForm';
import { CmsImageInput } from '../../_components/CmsImageInput';
import { CmsRepeater } from '../../_components/CmsRepeater';
import { Panel, PanelTitle, Field, PageEditorHeader } from '../../_components/ui';
import { savePageSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function HomePageEditor() {
  const h = await getHomeContent();

  return (
    <CmsForm action={savePageSettings} gap={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1180 }}>
        <PageEditorHeader crumb="PAGES / HOME" title="Home Page" subtitle="The landing page hero, stats, story and values." viewHref="/" />

        {/* HERO */}
        <Panel>
          <PanelTitle hint="the first thing visitors see">Hero</PanelTitle>
          <CmsImageInput
            name="home.hero.image"
            altName="home.hero.imageAlt"
            label="Background image"
            defaultValue={h.hero.image}
            defaultAlt={h.hero.imageAlt}
            folder="norvex/home"
            hint="Cloudinary · drag & drop · recommended 2000×1200, landscape"
            width={260}
            height={150}
          />
          <Field label="Eyebrow" name="home.hero.eyebrow" defaultValue={h.hero.eyebrow} placeholder="Hyderabad's Premier Football Academy" />
          <Field
            label="Headline"
            name="home.hero.headline"
            defaultValue={h.hero.headline}
            rows={3}
            hint="one line per row · wrap a word in *asterisks* to colour it red"
          />
          <Field label="Sub-headline" name="home.hero.sub" defaultValue={h.hero.sub} rows={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Primary button label" name="home.hero.primaryCtaLabel" defaultValue={h.hero.primaryCtaLabel} />
            <Field label="Primary button link" name="home.hero.primaryCtaHref" defaultValue={h.hero.primaryCtaHref} placeholder="/contact#trial" />
            <Field label="Secondary button label" name="home.hero.secondaryCtaLabel" defaultValue={h.hero.secondaryCtaLabel} />
            <Field label="Secondary button link" name="home.hero.secondaryCtaHref" defaultValue={h.hero.secondaryCtaHref} placeholder="/services" />
          </div>
        </Panel>

        {/* STATS */}
        <Panel>
          <PanelTitle hint="the band under the hero">Stats bar</PanelTitle>
          <CmsRepeater
            name="home.stats"
            defaultItems={h.stats.map((s) => ({ num: s.num, label: s.label }))}
            fields={[
              { key: 'num', placeholder: '8+', width: 110 },
              { key: 'label', placeholder: 'Programs' },
            ]}
            addLabel="+ Add stat"
            max={6}
          />
        </Panel>

        {/* ABOUT BLOCK */}
        <Panel>
          <PanelTitle hint='the "More than training." section'>About block</PanelTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Section title" name="home.about.title" defaultValue={h.about.title} />
            <Field label="Read-more link label" name="home.about.linkLabel" defaultValue={h.about.linkLabel} />
          </div>
          <CmsImageInput
            name="home.about.image"
            label="About image"
            defaultValue={h.about.image}
            folder="norvex/home"
            hint="recommended 1200×900, 4:3"
            width={220}
            height={150}
          />
          <p className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>
            The paragraph text comes from the <strong style={{ color: 'var(--t3)' }}>About</strong> page editor (shared “about — long” copy).
          </p>
        </Panel>

        {/* VALUES */}
        <Panel>
          <PanelTitle hint="the 5-tile values grid">Our values</PanelTitle>
          <CmsRepeater
            name="home.values"
            defaultItems={h.values.map((v) => ({ name: v.name, desc: v.desc, icon: v.icon ?? '' }))}
            fields={[
              { key: 'name', placeholder: 'Discipline', width: 150 },
              { key: 'desc', placeholder: 'Discipline & Consistency' },
              { key: 'icon', placeholder: 'shield', width: 120 },
            ]}
            addLabel="+ Add value"
            max={8}
          />
          <p className="mono" style={{ fontSize: 11, color: 'var(--t5)' }}>
            icon options: shield · activity · award · users · heart · trophy · target · flame
          </p>
        </Panel>
      </div>
    </CmsForm>
  );
}
