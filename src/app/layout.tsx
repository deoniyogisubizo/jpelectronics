import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "JP Tech — Electronics Store Rwanda",
  description: "Your trusted electronics marketplace in Rwanda. Shop smartphones, laptops, TVs, appliances, wearables, solar products and more.",
  keywords: "electronics, rwanda, smartphones, laptops, kigali, tech store",
  icons: {
    icon: [
      { url: '/favicon.svg?v=1', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg?v=1', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg?v=1', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg?v=1',
    apple: '/favicon.svg?v=1',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg?v=1" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.svg?v=1" sizes="32x32" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg?v=1" sizes="16x16" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} ${outfit.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen pb-20 md:pb-0">
            {children}
          </div>
          <BottomNavbar />
          <WhatsAppIcon />
        </Providers>
      </body>
    </html>
  );
}