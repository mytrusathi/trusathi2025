import React from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AppUser } from '@/types/appUser';
import { Users, ShieldCheck, Search, ArrowRight } from 'lucide-react';

async function getCommunities() {
  const q = query(collection(db, 'users'), where('role', '==', 'group-admin'), where('isApproved', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
}

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="grow">
        {/* Hero */}
        <div className="bg-indigo-900 pt-20 pb-32 px-4 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Verified Communities</h1>
              <p className="text-indigo-100 text-lg md:text-xl font-medium opacity-90">
                 Explore trusted matrimony groups managed by verified community leaders. 
                 Safe, authentic, and culturally relevant matches.
              </p>
           </div>
        </div>

        {/* List Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communities.length > 0 ? communities.map((community) => (
                <div key={community.uid} className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group border-b-4 border-b-rose-500/0 hover:border-b-rose-500 flex flex-col">
                   <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users size={32} />
                   </div>
                   
                   <h2 className="text-2xl font-bold text-slate-900 mb-2 truncate">{community.groupName || 'Unnamed Group'}</h2>
                   <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-4 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                      <ShieldCheck size={16} /> Verified Admin
                   </div>
                   
                   <p className="text-slate-500 mb-8 line-clamp-2">
                      Official matrimony division for {community.groupName || 'this community'}. 
                      Managed by {community.displayName}.
                   </p>
                   
                   <div className="mt-auto">
                      <Link 
                        href={`/community/${community.uid}`}
                        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-rose-600 hover:text-white rounded-2xl text-slate-700 font-bold transition-all"
                      >
                         <span>Browse Profiles</span>
                         <ArrowRight size={20} />
                      </Link>
                   </div>
                </div>
              )) : (
                <div className="col-span-full bg-white rounded-4xl p-20 text-center border border-dashed border-slate-200">
                   <Search className="mx-auto text-slate-200 mb-4" size={64} />
                   <h3 className="text-xl font-bold text-slate-800">No public groups found yet</h3>
                   <p className="text-slate-400 mt-2">Check back soon as more communities join our verified network.</p>
                </div>
              )}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
