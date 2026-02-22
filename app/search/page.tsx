'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicProfileCard from '@/components/PublicProfileCard';
import SearchBar from '@/components/SearchBar';
import { Loader2, FilterX } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Read params
  const role = searchParams.get('role') || 'Bride';
  const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!) : 18;
  const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : 60;
  const community = searchParams.get('community') || 'All Communities';

  // --- NEW HELPER: Calculate Age from DOB ---
  const calculateAge = (dobString: string | undefined): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const targetGender = role === 'Bride' ? 'female' : 'male';

        const profilesRef = collection(db, 'profiles');
        const q = query(
          profilesRef, 
          where('gender', '==', targetGender)
        );

        const querySnapshot = await getDocs(q);
        
        const fetchedProfiles: Profile[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Profile;
          
          // Client-Side Filtering
          
          // 1. Filter by Community
          if (community !== 'All Communities') {
             const religion = data.religion || '';
             if (!religion.toLowerCase().includes(community.toLowerCase())) {
               return; 
             }
          }

          // 2. Filter by Age (Calculated from DOB)
          const age = calculateAge(data.dob); // <--- FIXED HERE
          
          if (age < minAge || age > maxAge) {
            return; 
          }

          fetchedProfiles.push({ ...data, id: doc.id });
        });

        setProfiles(fetchedProfiles);

      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [role, minAge, maxAge, community]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {role === 'Bride' ? 'Brides' : 'Grooms'} for Matrimony
        </h1>
        <p className="text-gray-500">
          Showing matches for <span className="font-semibold text-indigo-600">{minAge} - {maxAge} years</span>
          {community !== 'All Communities' && <span> in <span className="font-semibold text-indigo-600">{community}</span> community</span>}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500">Finding best matches...</p>
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((profile) => (
             <a href="/login" key={profile.id}> 
               {/* Note: PublicProfileCard might need an update to show Age correctly too */}
               <PublicProfileCard profile={profile} />
             </a>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
             <FilterX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Matches Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any {role.toLowerCase()}s matching your criteria. 
            Try adjusting the age range or selecting "All Communities".
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') === 'Groom' ? 'Groom' : 'Bride') as 'Bride' | 'Groom';
  const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!, 10) : 18;
  const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : 60;
  const community = searchParams.get('community') || 'All Communities';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="bg-indigo-900 pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-xl font-bold mb-4 text-center md:text-left opacity-90">Modify Search</h2>
          <SearchBar
            variant="embedded"
            initialFilters={{
              lookingFor: role,
              ageMin: String(minAge),
              ageMax: String(maxAge),
              community,
            }}
          />
        </div>
      </div>
      
      <div className="grow bg-gray-50">
        <Suspense fallback={<div className="p-10 text-center">Loading search...</div>}>
          <SearchResults />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}