'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, limit, QueryConstraint } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicProfileCard from '@/components/PublicProfileCard';
import SearchBar from '@/components/SearchBar';
import { Loader2, FilterX, SlidersHorizontal, Search, MapPin, Sparkles, Handshake } from 'lucide-react';

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
      } catch (error: unknown) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [role, minAge, maxAge, community, occupation, education]);

  const cities = Array.from(new Set(profiles.map((p) => p.city).filter(Boolean))).sort((a, b) => (a as string).localeCompare(b as string));

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 rounded-full text-accent text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> Screened Matches
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
            Browse {role === 'Bride' ? 'Brides' : 'Grooms'}
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
            Finding your partner within <span className="text-foreground font-black underline decoration-accent/30 decoration-4 underline-offset-4">{community}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden shadow-sm">
                <div className="w-full h-full bg-muted-foreground/20 animate-pulse"></div>
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-black">
              {profiles.length}+
            </div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-3">Profiles Found</p>
        </div>
      </div>

      {/* Internal Search & Filter Bar */}
      <div className="bg-card rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border p-3 mb-16 flex flex-col lg:flex-row gap-3 backdrop-blur-xl">
        <div className="flex-1 relative group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={20} />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search name, city, caste or profession..."
            className="w-full pl-16 pr-8 py-5 bg-muted/30 border-none rounded-[2rem] focus:ring-2 focus:ring-accent/20 outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="lg:w-72 relative group">
          <MapPin className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={20} />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-16 pr-12 py-5 bg-muted/30 border-none rounded-[2rem] appearance-none focus:ring-2 focus:ring-accent/20 outline-none font-black text-foreground cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city as string} value={city as string}>
                {city as string}
              </option>
            ))}
          </select>
          <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <SlidersHorizontal size={18} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-accent">
              <Handshake size={28} className="animate-bounce" />
            </div>
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[11px]">Updating screened results...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {filteredProfiles.map((profile) => (
            <PublicProfileCard profile={profile} key={profile.id} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-[4rem] border border-border shadow-xl shadow-primary/5 p-24 text-center space-y-10">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground border-4 border-background shadow-inner">
            <FilterX className="w-16 h-16 opacity-50" />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-foreground tracking-tighter">No Matches Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto font-medium text-lg leading-relaxed">
              Try broadening your search criteria or removing filters to find more potential TruSathi matches.
            </p>
          </div>
          <button
            onClick={() => { setKeyword(''); setCityFilter('all'); }}
            className="px-12 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest"
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
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/20">
      <Navbar />

      <div className="bg-primary pt-24 pb-40 px-4 relative overflow-hidden border-b border-border/10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/5 border border-primary-foreground/10 rounded-full text-accent text-[10px] font-black uppercase tracking-[0.25em] mb-10 backdrop-blur-md">
            <SlidersHorizontal size={14} /> Custom Match Engine
          </div>
          <h2 className="text-primary-foreground text-5xl md:text-8xl font-black tracking-tighter mb-16 leading-none italic">
            Refine your <br className="hidden md:block" /> search filters.
          </h2>

          <div className="max-w-5xl mx-auto">
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

      <div className="grow -mt-24 relative z-20">
        <Suspense fallback={
          <div className="p-40 text-center flex flex-col items-center gap-4">
             <div className="w-16 h-16 border-4 border-muted border-t-accent rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing Engine...</p>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

// Main Page Component
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-10">
        <div className="w-20 h-20 border-4 border-muted border-t-accent rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">truSathi Search</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}