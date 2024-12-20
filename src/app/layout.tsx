import type { Metadata } from "next";
import localFont from "next/font/local";
import PWARegister from '@/app/components/pwa-register'
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'XRP Rich List Summary | Detailed XRP Holdings Analysis',
  description: 'Comprehensive analysis of XRP holdings, featuring real-time rich list data, price trends, and distribution metrics. Track top XRP wallets and market movements.',
  keywords: 'XRP, Rich List, Cryptocurrency, Blockchain Analysis, XRP Holdings, Market Data',
  openGraph: {
    siteName: 'XRP Rich List Summary',
    title: 'XRP Rich List Summary',
    description: 'Track and analyze XRP holdings with real-time rich list data',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/og/cloudinary?timestamp=${Date.now()}`,
        width: 1200,
        height: 630,
        alt: 'XRP Rich List Summary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shirome_x',
    creator: '@shirome_x',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/og/cloudinary?timestamp=${Date.now()}`],
    title: 'XRP Rich List Summary',
    description: 'Track and analyze XRP holdings with real-time rich list data',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
