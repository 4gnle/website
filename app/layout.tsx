import type { Metadata } from 'next';
import './globals.css';

const title = 'Angel Gomez | Product Engineer — React, TypeScript & AI';
const description = 'Product engineer in Santiago building web, mobile and AI products with TypeScript, React, React Native, Expo and Node.js. Former Product Lead at Pear Protocol.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
