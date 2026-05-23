import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { Icon } from '@/components/Icon';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Book a Free Trial',
  description: 'Get in touch with Norvex Sports — book a free trial, ask about programs, or enquire about events and birthday parties.',
};

export default async function ContactPage() {
  const c = await getSiteContent();
  const phoneTel = c.contact.phone.replace(/\s/g, '');

  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Contact us</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Start your football journey.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Free trial available. Drop us a line and our team will get back to you.
          </p>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-5">
          <div id="trial" className="lg:col-span-3">
            <div className="card">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-3xl text-white">Enquiry form</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300">
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" /> Free trial available
                </span>
              </div>
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <a href={`tel:${phoneTel}`} className="card flex items-center gap-4 hover:border-brand-500">
              <Icon name="phone" className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Phone</p>
                <p className="font-display text-xl text-white">{c.contact.phone}</p>
              </div>
            </a>
            <a href={`https://wa.me/${c.contact.whatsapp}`} target="_blank" rel="noreferrer noopener" className="card flex items-center gap-4 hover:border-brand-500">
              <Icon name="whatsapp" className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">WhatsApp</p>
                <p className="font-display text-xl text-white">Chat with us</p>
              </div>
            </a>
            <a href={`mailto:${c.contact.email}`} className="card flex items-center gap-4 hover:border-brand-500">
              <Icon name="mail" className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Email</p>
                <p className="font-display text-xl text-white break-all">{c.contact.email}</p>
              </div>
            </a>
            <div className="card flex items-center gap-4">
              <Icon name="pin" className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Location</p>
                <p className="font-display text-xl text-white">{c.contact.location}</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
