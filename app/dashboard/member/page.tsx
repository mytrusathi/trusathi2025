"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import ProfileCard from '@/components/group-admin/ProfileCard'; // Named import not needed, it is default
import ProfileForm from '@/components/group-admin/ProfileForm';
import { Loader2, Plus, FileText, ShieldCheck } from 'lucide-react';
import ChangePasswordCard from '@/components/ChangePasswordCard';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
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
          <div className="flex items-center gap-2">
             <div className="bg-rose-600 text-white p-2 rounded-lg">
                <FileText size={20} />
             </div>
             <h1 className="text-xl font-bold text-slate-800">My Profiles</h1>
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
        <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <h2 className="text-base font-bold text-indigo-900 flex items-center gap-2">
            <ShieldCheck size={18} /> Account Security
          </h2>
          <p className="text-sm text-indigo-700 mt-1">
            Use this section to change your login password anytime.
          </p>
        </section>

        <ChangePasswordCard />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : profiles.length === 0 ? (
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
            {profiles.map(profile => (
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
    </div>
  );
}