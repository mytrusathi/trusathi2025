import { Metadata } from 'next';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import { notFound } from 'next/navigation';
import ClientProfileView from '@/app/profile/[id]/ClientProfileView';

interface Props {
  params: Promise<{ id: string }>;
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const docRef = doc(db, 'profiles', id);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      return { title: 'Profile Not Found | TruSathi' };
    }
    
    const profile = snap.data() as Profile;
    const age = getAge(profile.dob);
    return {
      title: `View ${profile.name}'s Profile | TruSathi Matrimony`,
      description: `Check out ${profile.name}'s biodata on TruSathi. ${age} years old, ${profile.religion}, ${profile.caste}. Community verified matches.`,
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return { title: 'Biodata | TruSathi' };
  }
}

// Helper: Calculate Age from DOB
const getAge = (dob?: string) => {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default async function ProfilePage({ params }: Props) {
  try {
    const { id } = await params;
    
    // Fetch profile data
    const docRef = doc(db, 'profiles', id);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      notFound();
    }
    
    const profile = { ...snap.data(), id: snap.id } as Profile;
    const age = getAge(profile.dob);

    const creatorName = profile.creatorName || 'Self';
    const managedByGroup = profile.creatorGroupName || '';
    
    return <ClientProfileView profile={profile} age={age} creatorName={creatorName} managedByGroup={managedByGroup} />;
  } catch (error) {
    console.error('Profile fetch error:', error);
    notFound(); 
  }
}
