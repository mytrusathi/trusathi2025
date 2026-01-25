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
    // Check if adminId is a slug or UID to provide accurate SEO titles
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
    description: `Verified matches for ${groupName}. Profiles personally vetted by ${adminDisplayName}.`,
    openGraph: {
      title: `${groupName} Community Matrimony`,
      description: `Find your soulmate in the ${groupName} group. Verified by ${adminDisplayName}.`,
      url: `https://www.trusathi.com/community/${adminId}`,
      siteName: 'TruSathi',
      images: [{ url: 'https://www.trusathi.com/logo.png', width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website',
    },
  };
}

// 2. Server Component: Data Fetching Logic
export default async function CommunityPage({ params }: { params: { adminId: string } }) {
  const { adminId } = params;
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let resolvedAdminUid: string | null = null;

  try {
    // Step A: Resolve the adminId (Slug or UID) to the actual Firestore UID
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);

    if (!slugSnap.empty) {
      // If it's a slug, get the internal UID from the document ID
      const adminDoc = slugSnap.docs[0];
      adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      resolvedAdminUid = adminDoc.id;
    } else {
      // If no slug found, treat adminId as the UID directly
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
        resolvedAdminUid = adminDoc.id;
      }
    }

    // Step B: Fetch Profiles created by this specific Admin UID
    if (resolvedAdminUid) {
      const q = query(
        collection(db, 'profiles'), 
        where('createdBy', '==', resolvedAdminUid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedProfiles: Profile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProfiles.push({ ...doc.data(), id: doc.id } as Profile);
      });
      profiles = fetchedProfiles;
    }
  } catch (error) {
    console.error("Page data fetch error:", error);
  }

  // Pass the resolved admin info and their specific profiles to the client component
  return (
    <CommunityClientPage 
      initialAdmin={adminData} 
      initialProfiles={profiles} 
    />
  );
}