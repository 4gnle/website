import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Angel',
  description: 'How to find your way',
  openGraph: {
    title: 'Angel',
    description: 'How to find your way',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Angel',
    description: 'How to find your way',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
