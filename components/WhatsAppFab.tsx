import { getSiteContent } from '@/lib/settings';

export async function WhatsAppFab() {
  const c = await getSiteContent();
  return (
    <a
      href={`https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent('Hi Norvex Sports — I want to book a free trial.')}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-2xl shadow-emerald-900/50 transition hover:scale-105 active:scale-95"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.5A11 11 0 1 0 20.5 3.5zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3a8 8 0 1 1 6.6 3.5zm4.6-6c-.3-.2-1.5-.7-1.7-.8-.2-.1-.4-.2-.6.1-.2.3-.7.8-.8 1-.2.1-.3.2-.6 0-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.1-.2-.2-.5-.4z" />
      </svg>
    </a>
  );
}
