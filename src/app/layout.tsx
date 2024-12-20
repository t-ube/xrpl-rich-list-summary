import type { Metadata } from "next";
import localFont from "next/font/local";
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
    title: 'XRP Rich List Summary',
    description: 'Track and analyze XRP holdings with real-time rich list data',
    type: 'website',
    locale: 'en_US',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
