import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { siteUrl } from '@/lib/settings';
import { ORG_KEYWORDS } from '@/lib/seo';
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
  keywords: ORG_KEYWORDS,
  authors: [{ name: 'Norvex Sports' }],
  creator: 'Norvex Sports',
  publisher: 'Norvex Sports',
  // Self-referencing canonical for the homepage. Inner pages set their own
  // canonical via `pageMeta()` so nothing collapses to the homepage URL.
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Norvex Sports — News & Updates' }],
    },
  },
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
    site: '@NORVEXSPORTS',
    creator: '@NORVEXSPORTS',
    title: 'Norvex Sports — Football Development in Hyderabad',
    description: 'Professional football training, leagues and trials in Hyderabad.',
  },
  appleWebApp: {
    capable: true,
    title: 'Norvex Sports',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad, Telangana',
    'geo.position': '17.498302;78.3443668',
    ICBM: '17.498302, 78.3443668',
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
    icon: [
      { url: '/favicon.ico?v=3', sizes: '48x48 32x32', type: 'image/x-icon' },
      { url: '/favicon.png?v=3', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
