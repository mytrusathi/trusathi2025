import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // [NEW] Added premium fonts
import "./globals.css";
import { AuthProvider } from '../context/AuthContext'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default:"Trusathi – Community Verified Matrimony",
    template: "%s | Trusathi",
  },
  description: "Trusathi is a community-verified matrimony platform where profiles are curated by trusted group admins. Safe, authentic, and reliable matchmaking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
