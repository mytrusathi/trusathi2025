// app/community/[adminId]/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Profile } from '../../../types/profile';
import { AppUser } from '../../../types/appUser';
import PublicProfileCard from '../../../components/PublicProfileCard';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Loader2, Search, Users } from 'lucide-react';

export default function CommunityStorefront() {
  const { adminId } = useParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminData, setAdminData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Admin Branding Info
        const adminDoc = await getDoc(doc(db, 'users', adminId as string));
        if (adminDoc.exists()) {
          setAdminData(adminDoc.data() as AppUser);
        }

        // 2. Fetch Profiles uploaded by THIS admin
        const q = query(
          collection(db, 'profiles'), 
          where('createdBy', '==', adminId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedProfiles: Profile[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ ...doc.data(), id: doc.id } as Profile);
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchData();
  }, [adminId]);

  // Filtering logic within the admin's profiles
  const filteredProfiles = profiles.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.caste?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Dynamic Branding Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-rose-600" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {adminData?.groupName || "Community"} Matrimony
          </h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Find trusted matches verified by {adminData?.displayName || "our Group Admin"}.
          </p>
          
          {/* Search Box on Admin Page */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder={`Search within ${adminData?.groupName || 'this community'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((profile) => (
              <PublicProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-lg">No profiles found in this community yet.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}