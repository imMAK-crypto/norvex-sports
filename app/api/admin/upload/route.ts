import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cloudinaryConfigured, uploadDataUri } from '@/lib/cloudinary';

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
    if (!(file instanceof File)) return NextResponse.json({ error: 'no file' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'file too large (max 10MB)' }, { status: 413 });

    const buf = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buf.toString('base64')}`;
    const url = await uploadDataUri(dataUri, folder);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('upload failed', err);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
}
