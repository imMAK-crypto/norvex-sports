import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cloudinaryConfigured, uploadDataUriFull } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!cloudinaryConfigured) {
    return NextResponse.json(
      { error: 'Cloudinary not configured. Set CLOUDINARY_* env vars or paste image URLs directly.' },
      { status: 400 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    const folder = (form.get('folder') as string | null) ?? 'norvex';
    const usedOn = (form.get('usedOn') as string | null) ?? null;
    if (!(file instanceof File)) return NextResponse.json({ error: 'no file' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'file too large (max 10MB)' }, { status: 413 });

    // Defense-in-depth: only allow real image types (admin-only route, but never trust input).
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'unsupported file type — images only' }, { status: 415 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buf.toString('base64')}`;
    const up = await uploadDataUriFull(dataUri, folder);

    // Register in the Media Library (best-effort — never block the upload on this).
    try {
      await prisma.mediaAsset.create({
        data: {
          url: up.url,
          publicId: up.publicId,
          filename: file.name || up.publicId.split('/').pop() || 'upload',
          width: up.width,
          height: up.height,
          bytes: up.bytes,
          format: up.format,
          folder,
          usedOn,
        },
      });
    } catch (e) {
      console.warn('media asset record failed', e);
    }

    return NextResponse.json({ url: up.url });
  } catch (err) {
    console.error('upload failed', err);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
}
