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

export async function uploadDataUri(dataUri: string, folder = 'norvex'): Promise<string> {
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
  return res.secure_url;
}

export { cloudinary };
