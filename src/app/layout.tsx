import type { Metadata } from 'next';
import Link from 'next/link';
import { NEXT_PUBLIC_URL } from '../config';

import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import Providers from 'src/components/Providers';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'The Collector — Community-Governed Art on Base',
  description: 'Join early curators, vote on acquisitions, and help build a transparent cultural treasury.',
  openGraph: {
    title: 'The Collector — Community-Governed Art on Base',
    description: 'Join early curators, vote on acquisitions, and help build a transparent cultural treasury.',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
  metadataBase: new URL(NEXT_PUBLIC_URL || 'https://example.com'),
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>
          <header className="w-full">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              {/* Brand / Home link */}
              <Link href="/" className="text-lg font-semibold tracking-tight">
                The Collector
              </Link>

              {/* CTAs */}
              <nav className="flex items-center gap-3">
                <Link
                  href="https://forms.gle/7LvoD4iZoHSDbQgt7"
                  className="rounded-xl px-4 py-2 text-sm font-medium bg-white text-black hover:opacity-90"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Allowlist
                </Link>
                <Link
                  href="https://discord.gg/Pts2DU73Sr"
                  className="rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-white/20 hover:bg-white/10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Discord
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
