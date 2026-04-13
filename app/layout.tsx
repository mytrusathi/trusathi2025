import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // [NEW] Added premium fonts
import "./globals.css";
import { AuthProvider } from '../context/AuthContext'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';
<link rel="icon" type="image/svg+xml" href="/handshake.svg" />

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "truSathi | Your Search Companion",
    template: "%s | Trusathi",
  },
  icons: {
    icon: '/handshake.svg',
  },
  description: "Honesty in every Bond",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
        <NextTopLoader
          color="var(--brand-gold-500)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--brand-gold-500),0 0 5px var(--brand-gold-500)"
        />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
