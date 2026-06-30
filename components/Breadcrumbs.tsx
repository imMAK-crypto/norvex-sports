import { JsonLd } from './JsonLd';
import { breadcrumbLd } from '@/lib/seo';

/**
 * Emits BreadcrumbList structured data only — renders no visible markup.
 * Used to power breadcrumb rich results in Google search without changing
 * any on-page content.
 */
export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  if (!items.length) return null;
  return <JsonLd data={breadcrumbLd(items)} />;
}
