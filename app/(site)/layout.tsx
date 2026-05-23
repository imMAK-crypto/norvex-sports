import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { JsonLd } from '@/components/JsonLd';
import { getSiteContent, siteUrl } from '@/lib/settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getSiteContent();
  const url = siteUrl();

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${url}/#org`,
    name: 'Norvex Sports',
    url,
    logo: `${url}/favicon.svg`,
    image: `${url}/opengraph-image`,
    description: c.aboutShort,
    sport: 'Football',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    telephone: c.contact.phone,
    email: c.contact.email,
    sameAs: [c.social.instagram, c.social.facebook, c.social.youtube].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
