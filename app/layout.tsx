import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ask — A space for curiosity',
  description: 'What’s on your mind? A simple space to ask a question.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
