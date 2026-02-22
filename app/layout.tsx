import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../context/AuthContext'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
