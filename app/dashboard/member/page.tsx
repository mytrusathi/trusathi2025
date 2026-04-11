"use client";
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import ProfileCard from '@/components/group-admin/ProfileCard';
import ProfileForm from '@/components/group-admin/ProfileForm';
import { Loader2, Plus, UserCircle2, ShieldCheck, Home, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PasswordChangeModal from '@/components/PasswordChangeModal';

// Dashboard views and components
import FavoritesView from '@/components/dashboard/FavoritesView';
import InterestsView from '@/components/dashboard/InterestsView';
import ChatView from '@/components/dashboard/ChatView';
import PartnerPreferences from '@/components/dashboard/PartnerPreferences';
import CompletenessMeter from '@/components/dashboard/CompletenessMeter';
import OverviewView from '@/components/dashboard/OverviewView';

function MemberDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view');
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
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

  // View Switcher Logic
  const renderView = () => {
    switch (activeView) {
      case 'favorites':
        return <FavoritesView />;
      case 'sent-interests':
        return <InterestsView type="sent" />;
      case 'received-interests':
        return <InterestsView type="received" />;
      case 'chats':
        return <ChatView />;
      case 'partner-preferences':
        return <PartnerPreferences />;
      case 'my-profiles':
        // Main profiles view
        if (loading) return (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading your profiles...</p>
          </div>
        );
        
        if (profiles.length === 0) return (
          <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                <UserCircle2 size={48} strokeWidth={1} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No Profiles Found</h3>
             <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                Start by creating your first biodata. Verified profiles get more attention.
             </p>
             <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Create First Profile
             </button>
          </div>
        );

        return (
          <div className="space-y-12">
             {profiles.length > 0 && <CompletenessMeter profile={profiles[0]} />}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {profiles.map(profile => (
                 <ProfileCard key={profile.id} profile={profile} onEdit={handleEdit} onDelete={handleDelete} />
               ))}
             </div>
          </div>
        );
      default:
        return <OverviewView />;
    }
  };

  const getHeaderInfo = () => {
    switch(activeView) {
      case 'favorites': return { title: 'Shortlisted Profiles', desc: 'Profiles you want to keep in your final review list.' };
      case 'sent-interests': return { title: 'Sent Interests', desc: 'Requests you have sent to other candidates.' };
      case 'received-interests': return { title: 'Received Interests', desc: 'Inquiry and interest requests from others.' };
      case 'chats': return { title: 'Messaging Center', desc: 'Real-time conversations with your matches and the super admin trust desk.' };
      case 'partner-preferences': return { title: 'Match Criteria', desc: 'Define who you are looking for.' };
      case 'my-profiles': return { title: 'My Managed Profiles', desc: 'Create and manage biodatas for yourself or family members.' };
      default: return { title: 'Member Overview', desc: 'Track your activity and manage your matchmaking journey.' };
    }
  };

  const header = getHeaderInfo();

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => { setShowForm(false); setSelectedProfile(null); }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl font-bold text-sm transition-all hover:shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
           <ProfileForm 
            initialData={selectedProfile}
            onSuccess={handleSuccess}
            onCancel={() => { setShowForm(false); setSelectedProfile(null); }}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <main className="grow">
        {/* Dashboard Header */}
        <section className="bg-slate-900 pt-8 pb-14 px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent_70%)]"></div>
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="space-y-4 text-center md:text-left w-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Back to Home button */}
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest self-start"
                    >
                      <Home size={14} /> Home
                    </Link>
                    {activeView && (
                      <Link 
                        href="/dashboard/member" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all hover:-translate-x-1 text-xs font-bold uppercase tracking-widest"
                      >
                         <ArrowLeft size={14} /> Overview
                      </Link>
                    )}
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-indigo-500/20">
                       <ShieldCheck size={14} className="text-indigo-400" /> Member Center
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{header.title}</h1>
                  <p className="text-slate-400 text-base font-medium max-w-2xl leading-relaxed">{header.desc}</p>
              </div>
              {!activeView && profiles.length === 0 && (
                <button 
                  onClick={() => { setSelectedProfile(null); setShowForm(true); }}
                  className="bg-white text-slate-900 px-8 py-4 rounded-[2rem] font-black flex items-center gap-4 hover:bg-indigo-50 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 group shrink-0"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 text-indigo-600" /> 
                  <span className="uppercase tracking-[0.2em] text-[10px]">Create New Profile</span>
                </button>
              )}
           </div>
        </section>

        {/* Dynamic Content Grid */}
        <div className="bg-slate-50 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
            {renderView()}
          </div>
        </div>
      </main>

      {searchParams.get('view') === 'change-password' && <PasswordChangeModal closeHref="/dashboard/member" />}
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
