import type { Metadata } from 'next';
import './globals.css';

const title = "ANGEL";
const description = "he's building something maybe";
const siteUrl = process.env.SITE_URL
  || process.env.VERCEL_PROJECT_PRODUCTION_URL
  || process.env.VERCEL_URL
  || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.includes('://') ? siteUrl : `https://${siteUrl}`),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
