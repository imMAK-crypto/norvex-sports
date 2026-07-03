import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { JsonLd } from '@/components/JsonLd';
import { getSiteContent } from '@/lib/settings';
import { prisma, safeQuery } from '@/lib/prisma';
import { siteGraph } from '@/lib/seo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [c, services] = await Promise.all([
    getSiteContent(),
    safeQuery(
      () =>
        prisma.service.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: { slug: true, title: true, shortDesc: true },
        }),
      [] as Array<{ slug: string; title: string; shortDesc: string }>,
    ),
  ]);

  return (
    <>
      <JsonLd data={siteGraph(c, services)} />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
