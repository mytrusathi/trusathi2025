"use client";
import React, { useState } from 'react';
import { AppUser } from '@/types/appUser';
import { Profile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicProfileCard from '@/components/PublicProfileCard';
import { Search, Users, ShieldCheck, SlidersHorizontal } from 'lucide-react';

interface Props {
  initialAdmin: AppUser | null;
  initialProfiles: Profile[];
}

export default function CommunityClientPage({ initialAdmin, initialProfiles }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [religionFilter, setReligionFilter] = useState('all');

  const religions = Array.from(new Set(initialProfiles.map((p) => p.religion).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const filteredProfiles = initialProfiles.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.caste?.toLowerCase().includes(term) ||
      p.profession?.toLowerCase().includes(term);
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesReligion = religionFilter === 'all' || p.religion === religionFilter;
    return Boolean(matchesSearch && matchesGender && matchesReligion);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar /> {/* */}
      
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-6 border border-green-100">
            <ShieldCheck size={18} /> Community Verified
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {initialAdmin?.groupName || "Community"} Matrimony
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Profiles personally verified by <span className="font-bold text-slate-800">{initialAdmin?.displayName || "Admin"}</span>.
          </p>
          
          <div className="mt-10 max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text"
              placeholder={`Search within ${initialAdmin?.groupName || 'this community'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-lg"
            />
          </div>

          <div className="mt-4 max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <select
              value={religionFilter}
              onChange={(e) => setReligionFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Religions</option>
              {religions.map((religion) => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-3 text-sm text-slate-500 flex items-center justify-center gap-2">
            <SlidersHorizontal size={14} /> Showing {filteredProfiles.length} of {initialProfiles.length} profiles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4">
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProfiles.map((profile) => (
              <PublicProfileCard key={profile.id} profile={profile} /> /* */
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-4xl border border-slate-100 shadow-sm">
            <Users className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-400 text-xl font-medium">No matches found in this community.</p>
          </div>
        )}
      </div>

      <Footer /> {/* */}
    </div>
  );
}
