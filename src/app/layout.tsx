import type { Metadata } from 'next';
import { Tajawal, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const SITE_URL = 'https://www.crystalcleanlaundryservice.sa';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Crystal Clean Laundry Service | كريستال كلين لخدمات الغسيل',
  description:
    'Premium laundry pickup & delivery service in Dammam, Saudi Arabia. Book in under 2 minutes — no account needed. Free pickup & delivery, signature Oud fragrance finish.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  other: {
    google: 'notranslate',
  },
  openGraph: {
    type: 'website',
    siteName: 'Crystal Clean Laundry Service',
    title: 'Crystal Clean Laundry Service',
    description: 'Premium laundry pickup & delivery service in Dammam, Saudi Arabia. Free pickup & delivery, no account needed.',
    url: SITE_URL,
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crystal Clean Laundry Service',
    description: 'Premium laundry pickup & delivery service in Dammam, Saudi Arabia.',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ar" dir="rtl" translate="no" className={`${tajawal.variable} ${jakarta.variable} h-full antialiased notranslate`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
