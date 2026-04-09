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
import { Loader2, FilterX, SlidersHorizontal, Search, MapPin, Sparkles, Heart } from 'lucide-react';

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
  const occupation = searchParams.get('occupation') || 'All';
  const education = searchParams.get('education') || '';

  const getAge = (dob?: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
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
        const profilesRef = collection(db, 'profiles');
        const constraints: QueryConstraint[] = [
          where('isPublic', '==', true),
          where('gender', '==', role === 'Bride' ? 'female' : 'male'),
          limit(500)
        ];

        const q = query(profilesRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const fetchedProfiles: Profile[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Profile;
          const profileAge = getAge(data.dob);
          
          const matchesAge = profileAge >= minAge && profileAge <= maxAge;
          const matchesCommunity = community === 'All Communities' || data.religion === community;
          const matchesOccupation = occupation === 'All' || data.occupationCategory === occupation;
          const matchesEducation = !education || (data.education || '').toLowerCase().includes(education.toLowerCase());

          if (matchesAge && matchesCommunity && matchesOccupation && matchesEducation) {
            fetchedProfiles.push({ ...data, id: doc.id });
          }
        });

        setProfiles(fetchedProfiles);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [role, minAge, maxAge, community, occupation, education]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full text-rose-600 text-xs font-black uppercase tracking-wider">
             <Sparkles size={14} /> Verified Matches
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Browse {role === 'Bride' ? 'Brides' : 'Grooms'}
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
            Finding your partner within <span className="text-indigo-600 font-bold underline decoration-rose-200 decoration-4">{community}</span>. 
            All profiles are manualy verified by community admins.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                   <div className="w-full h-full bg-slate-200 animate-pulse"></div>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                 {profiles.length}+
              </div>
           </div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Profiles Found</p>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-3 mb-16 flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search name, city, caste or profession..."
            className="w-full pl-16 pr-6 py-4.5 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700"
          />
        </div>
        
        <div className="lg:w-64 relative group">
           <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
           <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-16 pr-10 py-4.5 bg-slate-50 border-none rounded-[2rem] appearance-none focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
             <SlidersHorizontal size={16} />
          </div>
        </div>

        <button className="lg:w-48 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-indigo-100 active:scale-95">
           Filter Results
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
             </div>
          </div>
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">Curation in progress...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {filteredProfiles.map((profile) => (
             <PublicProfileCard profile={profile} key={profile.id} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-24 text-center space-y-8">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border-4 border-white shadow-inner">
            <FilterX className="w-12 h-12" />
          </div>
          <div className="space-y-3">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">No Matches Exactly Here</h3>
             <p className="text-slate-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
               Try broadening your search criteria or selecting &apos;All Communities&apos; to find more potential TruSathi matches.
             </p>
          </div>
          <button 
             onClick={() => {setKeyword(''); setCityFilter('all');}}
             className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all"
          >
             Reset All Filters
          </button>
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
  const occupation = searchParams.get('occupation') || 'All';
  const education = searchParams.get('education') || '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <div className="bg-indigo-900 pt-20 pb-32 px-4 relative overflow-hidden">
        {/* Modern abstract decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
               <SlidersHorizontal size={14} /> Custom Match Engine
            </div>
            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-12 leading-none">
               Fine-tune your <br className="hidden md:block"/> search filters.
            </h2>
            
            <div className="max-w-4xl mx-auto">
               <SearchBar
                 variant="embedded"
                 initialFilters={{
                   lookingFor: role,
                   ageMin: String(minAge),
                   ageMax: String(maxAge),
                   community,
                   occupation,
                   education,
                 }}
               />
            </div>
        </div>
      </div>

      <div className="grow -mt-20 relative z-20">
        <Suspense fallback={<div className="p-32 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600 w-12 h-12" /></div>}>
          <SearchResults />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center p-10"><Loader2 size={64} className="animate-spin text-white opacity-20" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
