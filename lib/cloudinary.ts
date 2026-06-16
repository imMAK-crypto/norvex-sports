import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export type UploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
};

export async function uploadDataUriFull(dataUri: string, folder = 'norvex'): Promise<UploadResult> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary not configured. Set CLOUDINARY_* env vars or paste image URLs.');
  }
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto',
    overwrite: false,
    quality: 'auto:good',
    fetch_format: 'auto',
  });
  return {
    url: res.secure_url,
    publicId: res.public_id,
    width: res.width,
    height: res.height,
    bytes: res.bytes,
    format: res.format,
  };
}

export async function uploadDataUri(dataUri: string, folder = 'norvex'): Promise<string> {
  return (await uploadDataUriFull(dataUri, folder)).url;
}

/** Best-effort delete of a Cloudinary asset by public id. Never throws. */
export async function destroyAsset(publicId: string): Promise<void> {
  if (!cloudinaryConfigured || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('cloudinary destroy failed', err);
  }
}

export { cloudinary };
