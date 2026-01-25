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
    const snap = await getDocs(slugQuery);
    const data = !snap.empty ? snap.docs[0].data() : (await getDoc(doc(db, 'users', adminId))).data();
    groupName = data?.groupName || "Community";
  } catch (e) { console.error(e); }
  return { title: `${groupName} Matrimony | TruSathi` };
}

export default async function CommunityPage({ params }: { params: { adminId: string } }) {
  const { adminId } = params;
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let resolvedUid: string | null = null;

  try {
    // 1. Resolve slug in URL to actual Firestore UID
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);

    if (!slugSnap.empty) {
      // If found by slug, use the document ID as the UID
      const adminDoc = slugSnap.docs[0];
      adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      resolvedUid = adminDoc.id;
    } else {
      // Fallback: check if the adminId is already a UID
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
        resolvedUid = adminDoc.id;
      }
    }

    // 2. Fetch profiles using the internal UID (resolvedUid)
    // Profiles are stored with 'createdBy' matching the admin's UID
    if (resolvedUid) {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', resolvedUid));
      const profileSnap = await getDocs(q);
      profiles = profileSnap.docs.map(d => ({ ...d.data(), id: d.id } as Profile));
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return <CommunityClientPage initialAdmin={adminData} initialProfiles={profiles} />;
}