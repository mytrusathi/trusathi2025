import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // [NEW] Added premium fonts
import "./globals.css";
import { AuthProvider } from '../context/AuthContext'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL('https://trusathi.com'),
  title: {
    default: "TruSathi | Premium Matrimonial Platform for Serious Connections",
    template: "%s | TruSathi",
  },
  description: "TruSathi is a trust-focused matrimonial platform enabling secure, community-verified matchmaking. Honesty in every bond, privacy by choice.",
  keywords: ["Matrimony", "Marriage", "Relationship", "Community", "Verified Matchmaking", "Shaadi", "India"],
  authors: [{ name: "TruSathi Team" }],
  creator: "TruSathi",
  publisher: "TruSathi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/handshake.svg',
    shortcut: '/handshake.svg',
    apple: '/handshake.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://trusathi.com",
    siteName: "TruSathi",
    title: "TruSathi | Premium Matrimonial Platform",
    description: "Connect with genuine profiles through our community-verified matchmaking network.",
    images: [{ url: "/handshake.svg", width: 800, height: 600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TruSathi | Honest & Premium Matrimony",
    description: "Trusted matchmaking through decentralized community screening.",
    images: ["/handshake.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TruSathi",
  "url": "https://trusathi.com",
  "logo": "https://trusathi.com/handshake.svg",
  "description": "Premium trust-focused matrimonial platform.",
  "sameAs": [
    "https://facebook.com/trusathi",
    "https://twitter.com/trusathi",
    "https://instagram.com/trusathi"
  ]
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Matrimonial Service",
  "provider": {
    "@type": "Organization",
    "name": "TruSathi"
  },
  "areaServed": "IN",
  "description": "Authenticated community-verified matchmaking and matrimonial services."
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900 bg-page text-foreground">
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
