// app/community/[adminId]/page.tsx
import { Metadata } from 'next';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { AppUser } from '@/types/appUser';
import { Profile } from '@/types/profile';
import CommunityClientPage from './CommunityClientPage';

export async function generateMetadata({ params }: { params: { adminId: string } }): Promise<Metadata> {
  const { adminId } = params;
  let groupName = "Community";
  try {
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);
    const data = !slugSnap.empty ? slugSnap.docs[0].data() : (await getDoc(doc(db, 'users', adminId))).data();
    groupName = data?.groupName || "Community";
  } catch (e) { console.error(e); }

  return { 
    title: `${groupName} Matrimony | TruSathi`,
    description: `Find verified soulmate matches in the ${groupName} community.`
  };
}

export default async function CommunityPage({ params }: { params: { adminId: string } }) {
  const { adminId } = params;
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let resolvedUid: string | null = null;

  try {
    // 1. Resolve Admin Identity: Check if URL uses a Slug or direct UID
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);

    if (!slugSnap.empty) {
      const adminDoc = slugSnap.docs[0];
      adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      resolvedUid = adminDoc.id; // Map slug back to internal UID
    } else {
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
        resolvedUid = adminDoc.id;
      }
    }

    // 2. Fetch Profiles using the resolved internal UID
    if (resolvedUid) {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', resolvedUid));
      const snap = await getDocs(q);
      profiles = snap.docs.map(d => ({ ...d.data(), id: d.id } as Profile));
    }
  } catch (error) {
    console.error("Page data fetch error:", error);
  }

  return <CommunityClientPage initialAdmin={adminData} initialProfiles={profiles} />;
}