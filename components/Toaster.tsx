'use client';

import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#0a0f0d',
          color: '#e7efec',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: '#1aa54b', secondary: '#050807' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#050807' } },
      }}
    />
  );
}
