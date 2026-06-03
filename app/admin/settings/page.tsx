import { getSession } from '@/lib/auth';
import { cloudinaryConfigured } from '@/lib/cloudinary';
import { PasswordForm } from './PasswordForm';

export default async function SettingsPage() {
  const session = await getSession();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="text-sm text-silver-100/60 mt-1">Signed in as {session?.email}</p>
      </header>

      <section className="admin-card">
        <h2 className="font-display text-xl mb-4">Change password</h2>
        <PasswordForm />
      </section>

      <section className="admin-card">
        <h2 className="font-display text-xl mb-2">Image uploads</h2>
        {cloudinaryConfigured ? (
          <p className="text-sm text-brand-400">Cloudinary is configured — direct uploads enabled.</p>
        ) : (
          <p className="text-sm text-yellow-400">
            Cloudinary is not configured. Set <code className="text-silver-100">CLOUDINARY_CLOUD_NAME</code>,{' '}
            <code className="text-silver-100">CLOUDINARY_API_KEY</code>, and{' '}
            <code className="text-silver-100">CLOUDINARY_API_SECRET</code> environment variables to enable direct uploads.
            Until then, paste image URLs into the URL field.
          </p>
        )}
      </section>
    </div>
  );
}
