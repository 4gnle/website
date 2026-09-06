import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Angel Gomez — My story',
  description: 'The story of how Angel Gomez found his way from Venezuela to building a life online.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
