import { Metadata } from 'next';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { AppUser } from '@/types/appUser';
import { Profile } from '@/types/profile';
import CommunityClientPage from './CommunityClientPage';

// 1. Update generateMetadata to await params
export async function generateMetadata({ params }: { params: Promise<{ adminId: string }> }): Promise<Metadata> {
  const resolvedParams = await params; // Unwrapping the promise
  const { adminId } = resolvedParams;
  
  let groupName = "Community";
  try {
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const snap = await getDocs(slugQuery);
    const data = !snap.empty ? snap.docs[0].data() : (await getDoc(doc(db, 'users', adminId))).data();
    groupName = data?.groupName || "Community";
  } catch (e) { console.error(e); }
  return { title: `${groupName} Matrimony | TruSathi` };
}

// 2. Update the main component to await params
export default async function CommunityPage({ params }: { params: Promise<{ adminId: string }> }) {
  const resolvedParams = await params; // Unwrapping the promise
  const { adminId } = resolvedParams;
  
  let adminData: AppUser | null = null;
  let profiles: Profile[] = [];
  let resolvedUid: string | null = null;

  try {
    // 1. Resolve slug in URL to actual Firestore UID
    const slugQuery = query(collection(db, 'users'), where('slug', '==', adminId), limit(1));
    const slugSnap = await getDocs(slugQuery);

    if (!slugSnap.empty) {
      const adminDoc = slugSnap.docs[0];
      adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
      resolvedUid = adminDoc.id;
    } else {
      const adminDoc = await getDoc(doc(db, 'users', adminId));
      if (adminDoc.exists()) {
        adminData = { ...adminDoc.data(), uid: adminDoc.id } as AppUser;
        resolvedUid = adminDoc.id;
      }
    }

    // 2. Fetch profiles using the internal UID (resolvedUid)
    if (resolvedUid) {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', resolvedUid));
      const profileSnap = await getDocs(q);
      profiles = profileSnap.docs
        .map(d => ({ ...d.data(), id: d.id } as Profile))
        .filter((profile) => profile.isPublic !== false);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return <CommunityClientPage initialAdmin={adminData} initialProfiles={profiles} />;
}
