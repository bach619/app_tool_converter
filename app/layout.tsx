import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const DynamicToaster = dynamic(() => import('sonner').then((mod) => mod.Toaster), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'I have Tools - Free Online Multi-Tool App | Currency Converter, Calculator & More',
  description: 'Free online tools including currency converter, unit converter, time zone converter, calculator, and wheel of names. Fast, accurate, and no installation required. Convert currencies, calculate units, manage time zones instantly.',
  metadataBase: new URL('https://ihavetools.com'),
  keywords: 'currency converter, unit converter, calculator, time zone converter, wheel of names, online tools, free tools, conversion tools',
  authors: [{ name: 'I have Tools' }],
  creator: 'I have Tools',
  publisher: 'I have Tools',
  robots: 'index, follow',
  openGraph: {
    title: 'I have Tools - Free Online Multi-Tool App',
    description: 'Free online tools including currency converter, unit converter, time zone converter, calculator, and wheel of names. No installation required.',
    url: 'https://ihavetools.com',
    siteName: 'I have Tools',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I have Tools - Free Online Multi-Tool App',
    description: 'Free online tools including currency converter, unit converter, time zone converter, calculator, and wheel of names.',
    creator: '@ihavetools',
  },
  alternates: {
    canonical: 'https://ihavetools.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6435811821902528" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6435811821902528" crossOrigin="anonymous"></script>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CMNMHEDM4B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CMNMHEDM4B');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <DynamicToaster position="bottom-right" />
      </body>
    </html>
  );
}