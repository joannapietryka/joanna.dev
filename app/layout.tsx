import {Analytics} from '@vercel/analytics/next';
import {cookies} from 'next/headers';
import {JetBrains_Mono, Playfair_Display, Sora} from 'next/font/google';
import type {Metadata} from 'next';

import './globals.css';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin']
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin']
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin']
});

export const metadata: Metadata = {
  icons: {
    /* Prefer small ICO + PNG; public/favicon.svg is multi‑MB and hurts tab icon loads */
    icon: [
      {url: '/favicon.ico', sizes: 'any'},
      {url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png'}
    ],
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-intl sets NEXT_LOCALE; use it to keep <html lang> correct.
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

  return (
    <html
      lang={locale}
      className={`${jetBrainsMono.variable} ${playfairDisplay.variable} ${sora.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
