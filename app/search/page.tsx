import { Metadata } from 'next';
import ClientSearch from '@/components/ClientSearch';

export const metadata: Metadata = {
  title: "Premium Search | Discover Your Life Partner",
  description: "Browse verified profiles on TruSathi. Filter by community, age, and interest to find your most compatible Sathi with absolute privacy.",
  keywords: ["Search Profiles", "Matrimonial Search", "Verified Matchmaking", "Find Partner"],
};

export default function SearchPage() {
  return <ClientSearch />;
}