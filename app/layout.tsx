import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { siteUrl } from '@/lib/settings';
import { AppToaster } from '@/components/Toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });

const url = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: 'Norvex Sports — Football Development in Hyderabad',
    template: '%s · Norvex Sports',
  },
  description:
    'Norvex Sports is a professional football development platform in Hyderabad — grassroots to elite training, leagues, trials and tournaments.',
  keywords: [
    'Norvex Sports',
    'football academy Hyderabad',
    'football training Hyderabad',
    'youth football India',
    'soccer academy Hyderabad',
    'football trials',
    'football coaching',
    'kids football Hyderabad',
    'football clinic',
  ],
  authors: [{ name: 'Norvex Sports' }],
  creator: 'Norvex Sports',
  publisher: 'Norvex Sports',
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url,
    siteName: 'Norvex Sports',
    title: 'Norvex Sports — Football Development in Hyderabad',
    description:
      'Professional football training, leagues and trials in Hyderabad. Grassroots to elite pathway.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Norvex Sports — Football Development in Hyderabad',
    description: 'Professional football training, leagues and trials in Hyderabad.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml' }],
  },
  manifest: '/site.webmanifest',
  category: 'sports',
};

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        {children}
        <AppToaster />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
