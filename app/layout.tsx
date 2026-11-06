import type { Metadata, Viewport } from 'next';
import { Gloock, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Chrome from '@/components/Chrome';

const display = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const body = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mera Journey — Nepal & Bhutan Travel Advisor',
  description:
    'Private journeys in Nepal and Bhutan, designed by Kai Mai, who lived in Nepal for four months, climbed Mera Peak and made a mad honey documentary.',
};

export const viewport: Viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Chrome />
        <main id="main">{children}</main>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
