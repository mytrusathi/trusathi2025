"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import ProfileCard from '@/components/group-admin/ProfileCard'; // Named import not needed, it is default
import ProfileForm from '@/components/group-admin/ProfileForm';
import { Loader2, Plus, FileText, Search, SlidersHorizontal, UserCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import PasswordChangeModal from '@/components/PasswordChangeModal';

export default function MemberDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const showPasswordModal = searchParams.get('view') === 'change-password';
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [religionFilter, setReligionFilter] = useState('all');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Fetch User's Profiles
  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetched: Profile[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ ...doc.data(), id: doc.id } as Profile);
      });
      setProfiles(fetched);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Handlers
  const handleEdit = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await deleteDoc(doc(db, 'profiles', id));
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedProfile(null);
    fetchProfiles();
  };

  const religions = Array.from(new Set(profiles.map((p) => p.religion).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const filteredProfiles = profiles.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (p.name?.toLowerCase() || '').includes(q) ||
      (p.city?.toLowerCase() || '').includes(q) ||
      (p.caste?.toLowerCase() || '').includes(q) ||
      (p.profession?.toLowerCase() || '').includes(q);
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesReligion = religionFilter === 'all' || p.religion === religionFilter;
    return matchesSearch && matchesGender && matchesReligion;
  });

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <ProfileForm 
          initialData={selectedProfile}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setSelectedProfile(null); }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-rose-600 text-white p-2 rounded-lg">
                <FileText size={20} />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800">My Profiles</h1>
               <p className="text-xs text-slate-500 flex items-center gap-1">
                 <UserCircle2 size={14} /> {user?.displayName || user?.email || 'Member'}
               </p>
             </div>
          </div>
          <button 
            onClick={() => { setSelectedProfile(null); setShowForm(true); }}
            className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors"
          >
            <Plus size={18} /> Create New
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, caste, profession..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              <select
                value={religionFilter}
                onChange={(e) => setReligionFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">All Religions</option>
                {religions.map((religion) => (
                  <option key={religion} value={religion}>
                    {religion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 flex items-center gap-2">
            <SlidersHorizontal size={14} /> Showing {filteredProfiles.length} of {profiles.length} profiles
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Profiles Yet</h3>
            <p className="text-slate-500 mb-6">Create a biodata to start searching for matches.</p>
            <button 
               onClick={() => setShowForm(true)}
               className="text-rose-600 font-bold hover:underline"
            >
               Create your first profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <ProfileCard 
                key={profile.id}
                profile={profile}
                onEdit={handleEdit}     // ONLY passing valid props now
                onDelete={handleDelete} // ONLY passing valid props now
              />
            ))}
          </div>
        )}
      </main>

      {showPasswordModal && <PasswordChangeModal closeHref="/dashboard/member" />}
    </div>
  );
}
