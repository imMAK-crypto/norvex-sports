import { getSiteContent } from '@/lib/settings';
import { saveSiteContent } from './actions';

export default async function ContentAdminPage() {
  const c = await getSiteContent();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Site content</h1>
        <p className="text-sm text-white/60 mt-1">About, project statement, contact details, social links.</p>
      </header>
      <form action={saveSiteContent} className="admin-card space-y-6">
        <Field name="site.tagline" label="Tagline" defaultValue={c.tagline} />
        <Field name="site.aboutShort" label="About — short (homepage / footer)" defaultValue={c.aboutShort} multiline />
        <Field name="site.aboutLong" label="About — long (about page)" defaultValue={c.aboutLong} rows={10} multiline />
        <Field name="site.projectStatement" label="The Norvex Project statement" defaultValue={c.projectStatement} rows={6} multiline />

        <hr className="border-white/10" />
        <h2 className="font-display text-xl">Contact</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="contact.phone" label="Phone" defaultValue={c.contact.phone} />
          <Field name="contact.email" label="Email" defaultValue={c.contact.email} />
          <Field name="contact.whatsapp" label="WhatsApp (digits only with country code)" defaultValue={c.contact.whatsapp} />
          <Field name="contact.location" label="Location" defaultValue={c.contact.location} />
          <Field name="contact.careersEmail" label="Careers email" defaultValue={c.contact.careersEmail} />
        </div>

        <hr className="border-white/10" />
        <h2 className="font-display text-xl">Social</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Field name="social.instagram" label="Instagram URL" defaultValue={c.social.instagram} />
          <Field name="social.facebook" label="Facebook URL" defaultValue={c.social.facebook} />
          <Field name="social.youtube" label="YouTube URL" defaultValue={c.social.youtube} />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  multiline,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={rows} className="input" />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className="input" />
      )}
    </div>
  );
}
