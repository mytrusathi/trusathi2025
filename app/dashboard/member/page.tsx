"use client";
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import ProfileCard from '@/components/group-admin/ProfileCard';
import ProfileForm from '@/components/group-admin/ProfileForm';
import { Loader2, Plus, FileText, Search, SlidersHorizontal, UserCircle2, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import PasswordChangeModal from '@/components/PasswordChangeModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function MemberDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const showPasswordModal = searchParams.get('view') === 'change-password';
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [religionFilter, setReligionFilter] = useState('all');
  
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', user.uid), limit(500));
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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12">
           <ProfileForm 
            initialData={selectedProfile}
            onSuccess={handleSuccess}
            onCancel={() => { setShowForm(false); setSelectedProfile(null); }}
           />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />
      
      <main className="grow">
        {/* Profile Header Banner */}
        <section className="bg-indigo-900 pt-16 pb-24 px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-transparent"></div>
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                     <ShieldCheck size={14} className="text-emerald-400" /> Managed by You
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your Managed Profiles</h1>
                  <p className="text-indigo-200 text-lg font-medium">Create and manage biodatas for yourself or family members.</p>
              </div>
              <button 
                onClick={() => { setSelectedProfile(null); setShowForm(true); }}
                className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-50 transition-all shadow-xl shadow-indigo-950/20 active:scale-95"
              >
                <Plus size={20} /> Add New Profile
              </button>
           </div>
        </section>

        {/* Filters & Grid */}
        <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20">
           
           <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-3 mb-12 flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter name, city, profession..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium transition-all"
                />
              </div>
              <div className="lg:w-96 flex gap-3">
                 <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                    className="flex-1 px-4 py-4 bg-slate-50 border-none rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold text-slate-600 text-sm"
                  >
                    <option value="all">Any Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                  <select
                    value={religionFilter}
                    onChange={(e) => setReligionFilter(e.target.value)}
                    className="flex-1 px-4 py-4 bg-slate-50 border-none rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold text-slate-600 text-sm"
                  >
                    <option value="all">Any Religion</option>
                    {religions.map((religion) => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </select>
              </div>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center py-24 space-y-4">
               <Loader2 className="animate-spin text-indigo-600" size={48} />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading data...</p>
             </div>
           ) : filteredProfiles.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                   <UserCircle2 size={48} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Profiles Found</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                   Start by creating your first biodata. Verified profiles get more attention.
                </p>
                <button 
                   onClick={() => setShowForm(true)}
                   className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                   Create First Profile
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredProfiles.map(profile => (
                 <div key={profile.id} className="transform transition-all hover:-translate-y-2">
                    <ProfileCard 
                      profile={profile}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>

      <Footer />
      {showPasswordModal && <PasswordChangeModal closeHref="/dashboard/member" />}
    </div>
  );
}

export default function MemberDashboard() {
  return (
    <ProtectedRoute allowedRoles={['member', 'group-admin', 'super-admin']}>
      <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 size={48} className="animate-spin text-white opacity-20" /></div>}>
        <MemberDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
