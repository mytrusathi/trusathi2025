'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
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
  const [keyword, setKeyword] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const role = searchParams.get('role') || 'Bride';
  const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!, 10) : 18;
  const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : 60;
  const community = searchParams.get('community') || 'All Communities';

  const calculateAge = (dobString: string | undefined): number | null => {
    if (!dobString) return null;

    const birthDate = new Date(dobString);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const matchesRole = (gender: string | undefined, lookingFor: string): boolean => {
    const normalizedGender = (gender || '').trim().toLowerCase();

    if (lookingFor === 'Bride') {
      return ['female', 'f', 'woman', 'bride'].includes(normalizedGender);
    }

    return ['male', 'm', 'man', 'groom'].includes(normalizedGender);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profilesRef = collection(db, 'profiles');
        const querySnapshot = await getDocs(profilesRef);

        const fetchedProfiles: Profile[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Profile;
          if (data.isPublic === false) {
            return;
          }

          if (!matchesRole(data.gender, role)) {
            return;
          }

          if (community !== 'All Communities') {
            const religion = data.religion || '';
            if (!religion.toLowerCase().includes(community.toLowerCase())) {
              return;
            }
          }

          const age = calculateAge(data.dob);
          if (age !== null && (age < minAge || age > maxAge)) {
            return;
          }

          fetchedProfiles.push({ ...data, id: doc.id });
        });

        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [role, minAge, maxAge, community]);

  const cities = Array.from(new Set(profiles.map((p) => p.city).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const filteredProfiles = profiles.filter((p) => {
    const q = keyword.toLowerCase();
    const matchesKeyword =
      (p.name?.toLowerCase() || '').includes(q) ||
      (p.city?.toLowerCase() || '').includes(q) ||
      (p.caste?.toLowerCase() || '').includes(q) ||
      (p.profession?.toLowerCase() || '').includes(q);
    const matchesCity = cityFilter === 'all' || p.city === cityFilter;
    return matchesKeyword && matchesCity;
  });

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

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, city, caste, profession..."
          className="md:col-span-2 px-4 py-2.5 border border-gray-200 rounded-lg"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg"
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500">Finding best matches...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <a href="/login" key={profile.id}>
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
            We couldn&apos;t find any {role.toLowerCase()}s matching your criteria.
            Try adjusting the age range or selecting &quot;All Communities&quot;.
          </p>
        </div>
      )}
    </div>
  );
}

function SearchPageContent() {
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white p-10 text-center">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
