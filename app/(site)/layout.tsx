import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { JsonLd } from '@/components/JsonLd';
import { getSiteContent } from '@/lib/settings';
import { siteGraph } from '@/lib/seo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getSiteContent();

  return (
    <>
      <JsonLd data={siteGraph(c)} />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
