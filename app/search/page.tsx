'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicProfileCard from '@/components/PublicProfileCard';
import SearchBar from '@/components/SearchBar';
import { Loader2, FilterX, SlidersHorizontal, Search } from 'lucide-react';

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

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profilesRef = collection(db, 'profiles');
        const constraints: QueryConstraint[] = [
          where('isPublic', '==', true),
          where('gender', '==', role === 'Bride' ? 'female' : 'male'),
        ];

        // 1. Community Filter (Exact match on Religion)
        if (community !== 'All Communities') {
          constraints.push(where('religion', '==', community));
        }

        // 2. Age Range via DOB logic
        // minAge 18 -> latest dob should be approx 18 years ago
        // maxAge 30 -> oldest dob should be approx 30 years ago
        const now = new Date();
        const maxDobYear = now.getFullYear() - minAge;
        const minDobYear = now.getFullYear() - maxAge;
        
        // Formulate ISO-like date strings for string comparison (YYYY-MM-DD)
        const maxDob = `${maxDobYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const minDob = `${minDobYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        // Note: Using multiple range/inequality filters requires composite indexes.
        // We will stick to fetching and refining if needed, but the prompt asked for functional query.
        // Let's add the DOB constraints.
        constraints.push(where('dob', '>=', minDob));
        constraints.push(where('dob', '<=', maxDob));
        
        constraints.push(limit(500));

        const q = query(profilesRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const fetchedProfiles: Profile[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ ...doc.data(), id: doc.id } as Profile);
        });

        setProfiles(fetchedProfiles);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        // If index is missing, Firebase usually provides a link in the console error.
        // We'll fallback to a broader query if it fails (optional, but good for UX)
        if (error.code === 'failed-precondition') {
           console.warn("Firestore index missing for this query combination.");
        }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Searching for {role === 'Bride' ? 'Brides' : 'Grooms'}
          </h1>
          <p className="text-slate-500 text-lg">
            Showing verified matches between <span className="font-bold text-rose-600">{minAge} - {maxAge} years</span>
            {community !== 'All Communities' && <span> in the <span className="font-bold text-rose-600">{community}</span> community</span>}
          </p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 border border-slate-200">
           <SlidersHorizontal size={16} /> Filtered Results
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search name, city, caste..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
        </div>
        <div className="relative">
           <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:ring-2 focus:ring-rose-500/20 outline-none whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <button className="h-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-200">
           Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">Finding your perfect match...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          {filteredProfiles.map((profile) => (
             <PublicProfileCard profile={profile} key={profile.id} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <FilterX className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No Matches Found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Try broadening your search criteria or selecting &apos;All Communities&apos; to find more potential matches.
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
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <div className="bg-indigo-900 pt-16 pb-24 px-4 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-4 text-center md:text-left">Refine your search</h2>
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

      <div className="grow -mt-12 relative z-20">
        <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>}>
          <SearchResults />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-10 text-center flex flex-col items-center justify-center"><Loader2 size={48} className="animate-spin text-rose-500" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
