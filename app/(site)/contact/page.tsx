import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { PageHeader } from '@/components/PageHeader';
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
      <PageHeader
        eyebrow="Contact us"
        title="Start your football journey."
        intro="Free trial available. Drop us a line and our team will get back to you within one working day."
      />

      <Section id="trial">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="border border-ink-500 bg-ink-800 p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-3xl uppercase tracking-wide text-silver-100">Enquiry Form</h2>
                <span className="inline-flex items-center gap-2 border border-brand-600/40 bg-brand-600/10 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" /> Free Trial Available
                </span>
              </div>
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <a href={`tel:${phoneTel}`} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Phone</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">{c.contact.phone}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/${c.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600"
            >
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><MessageCircle className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">WhatsApp</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">Chat with us</p>
              </div>
            </a>
            <a href={`mailto:${c.contact.email}`} className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-600">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Email</p>
                <p className="font-display text-lg break-all text-silver-100">{c.contact.email}</p>
              </div>
            </a>
            <div className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><MapPin className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Location</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">{c.contact.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border border-ink-500 bg-ink-800 p-5">
              <span className="grid h-11 w-11 place-items-center bg-brand-600/10 text-brand-600"><Clock className="h-5 w-5" /></span>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-silver-500">Response Time</p>
                <p className="font-display text-xl uppercase tracking-wide text-silver-100">Within 24 hours</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* CTA strip */}
      <section className="bg-brand-600">
        <div className="container-x py-10 md:py-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-silver-100">
            Book a Trial Session · Contact Us Now
          </h2>
          <p className="mt-2 font-sans text-sm text-silver-100/80">
            First session is on us. Just bring your boots.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`tel:${phoneTel}`} className="inline-flex items-center bg-silver-100 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-brand-600 transition hover:bg-silver-100">
              <Phone className="mr-2 h-4 w-4" /> Call {c.contact.phone}
            </a>
            <a
              href={`https://wa.me/${c.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center border-2 border-silver-100 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-silver-100 transition hover:bg-silver-100 hover:text-brand-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
