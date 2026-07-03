import { prisma, safeQuery } from '@/lib/prisma';
import { cloudinaryConfigured } from '@/lib/cloudinary';
import { MediaLibrary, type MediaItem } from './MediaLibrary';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const assets = await safeQuery(
    () => prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
    [],
  );

  const items: MediaItem[] = assets.map((a) => ({
    id: a.id,
    url: a.url,
    filename: a.filename,
    alt: a.alt,
    width: a.width,
    height: a.height,
    bytes: a.bytes,
    format: a.format,
    folder: a.folder,
    createdAt: a.createdAt.toISOString(),
  }));

  return <MediaLibrary initial={items} cloudinaryReady={cloudinaryConfigured} />;
}
