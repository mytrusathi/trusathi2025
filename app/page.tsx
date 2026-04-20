import { Metadata } from 'next';
import ClientHome from '@/components/ClientHome';

export const metadata: Metadata = {
  title: "TruSathi | Premium Matrimonial Platform for Serious Connections",
  description: "Experience the most trusted community-verified matrimony platform. TruSathi connects hearts through decentralized trust, manual profile screening, and absolute privacy.",
  keywords: [
    "Matrimonial", 
    "Premium Matrimony", 
    "Community Matchmaking", 
    "Shaadi", 
    "Indian Wedding", 
    "Trusted Matrimony", 
    "Verified Profiles", 
    "Privacy Matchmaking"
  ],
  openGraph: {
    title: "TruSathi | Your Journey to a True Life Partner",
    description: "Simplifying the search for a life partner with community trust and absolute privacy.",
    url: "https://trusathi.com",
    siteName: "TruSathi",
    images: [
      {
        url: "/handshake.svg", // Fallback for now, ideally a richer hero image
        width: 800,
        height: 600,
        alt: "TruSathi Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruSathi | Honest & Premium Matrimony",
    description: "A secure sanctuary for finding your life partner through community screening.",
    images: ["/handshake.svg"],
  },
};

export default function HomePage() {
  return <ClientHome />;
}