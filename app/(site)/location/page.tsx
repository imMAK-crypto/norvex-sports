import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/settings';
import { Section } from '@/components/Section';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Our Location',
  description: 'Norvex Sports is based in Hyderabad, Telangana — serving players across the city with structured training and competitive exposure.',
};

export default async function LocationPage() {
  const c = await getSiteContent();
  return (
    <>
      <header className="grid-bg">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Our location</span>
          <h1 className="headline mt-3 text-5xl md:text-6xl">Built in Hyderabad.</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Norvex Sports is currently based in Hyderabad, Telangana, focused on building a strong football
            development ecosystem through structured training and professional coaching.
          </p>
        </div>
      </header>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card">
            <Icon name="pin" className="h-6 w-6 text-brand-400" />
            <h3 className="mt-3 font-display text-2xl text-white">{c.contact.location}</h3>
            <p className="mt-2 text-sm text-white/70">
              We serve players across different areas of the city, making quality football training accessible to
              aspiring athletes.
            </p>
            <div className="mt-6 grid gap-2 text-sm">
              <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="text-brand-400 hover:underline">{c.contact.phone}</a>
              <a href={`mailto:${c.contact.email}`} className="text-brand-400 hover:underline">{c.contact.email}</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="Norvex Sports — Hyderabad"
              src="https://www.google.com/maps?q=Hyderabad,Telangana&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full"
            />
          </div>
        </div>
      </Section>

      <Section eyebrow="What's next" title="Expanding outward." className="bg-white/[0.02]">
        <div className="mx-auto max-w-2xl text-center text-white/70">
          As we grow, we plan to expand our presence to multiple locations and cities, bringing structured sports
          development programs to a wider community.
        </div>
      </Section>
    </>
  );
}
