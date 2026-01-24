import { Metadata } from 'next';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { AppUser } from '@/types/appUser';
import { Profile } from '@/types/profile';
import CommunityClientPage from './CommunityClientPage';

// 1. SEO & Social Preview Generator (Server-Side)
export async function generateMetadata({ params }: { params: { adminId: string } }): Promise<Metadata> {
  const { adminId } = params;
  let groupName = "Community";
  let adminDisplayName = "our Group Admin";

  try {
    // Check if adminId is a slug or UID
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);
    
    if (!slugSnap.empty) {
      const data = slugSnap.docs[0].data() as AppUser;
      groupName = data.groupName || "Community";
      adminDisplayName = data.displayName || "Admin";
    } else {
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        const data = adminDoc.data() as AppUser;
        groupName = data.groupName || "Community";
        adminDisplayName = data.displayName || "Admin";
      }
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: `${groupName} Matrimony | TruSathi`,
    description: `Verified matches for ${groupName}. Profiles personally vetted by ${adminDisplayName}. Safe, authentic, and community-focused matchmaking.`,
    openGraph: {
      title: `${groupName} Community Matrimony`,
      description: `Find your soulmate in the ${groupName} group. Verified by ${adminDisplayName}.`,
      url: `https://www.trusathi.com/community/${adminId}`,
      siteName: 'TruSathi',
      images: [
        {
          url: 'https://www.trusathi.com/logo.png', // Ensure this exists in your /public folder
          width: 1200,
          height: 630,
          alt: `${groupName} Matrimony on TruSathi`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${groupName} Matrimony | TruSathi`,
      description: `Trusted matches for ${groupName} community.`,
      images: ['https://www.trusathi.com/logo.png'],
    },
  };
}

// 2. Server Component: Initial Data Fetch
export default async function CommunityPage({ params }: { params: { adminId: string } }) {
  const { adminId } = params;
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let adminUid = adminId;

  try {
    // Fetch Admin Info
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);

    if (!slugSnap.empty) {
      const adminDoc = slugSnap.docs[0];
      adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      adminUid = adminDoc.id;
    } else {
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      }
    }

    // Fetch Initial Profiles
    if (adminData) {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', adminUid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        profiles.push({ ...doc.data(), id: doc.id } as Profile);
      });
    }
  } catch (error) {
    console.error("Page data fetch error:", error);
  }

  // Pass data to Client Component for search/interactivity
  return <CommunityClientPage initialAdmin={adminData} initialProfiles={profiles} />;
}