import type { Metadata } from 'next';
import './globals.css';

const title = 'Angel Gomez | Product Engineer LATAM';
const description = 'Product engineer based in Santiago, Chile, LATAM. Built and launched APEX. Former Product Lead at Pear Protocol.';

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
