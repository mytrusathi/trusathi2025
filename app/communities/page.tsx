import React from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AppUser } from '@/types/appUser';
import { Metadata } from 'next';
import { Users, ShieldCheck, Search, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Verified Communities | Join Your People",
  description: "Explore trusted matrimony groups managed by verified community leaders. Find matches within your specific community with the highest degree of trust and cultural relevance.",
  keywords: ["Community Matrimony", "Verified Groups", "Caste Matrimony", "Secure Matchmaking", "Cultural Connections"],
};

async function getCommunities() {
  const q = query(collection(db, 'users'), where('role', '==', 'group-admin'), where('isApproved', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
}

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary/10">
      <Navbar />
      
      <main className="grow">
        {/* Refined Hero with Brand Consistency */}
        <div className="relative bg-background pt-40 pb-52 px-4 overflow-hidden border-b border-border/10">
          {/* Subtler Animated Background Layers */}
          <div className="absolute inset-0 animate-mesh opacity-20 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(circle_at_top,var(--primary)/0.03,transparent_70%)] pointer-events-none animate-pulse duration-[8000ms]" />
          
          {/* Floating Luxury Accents */}
          <div className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-card/80 border border-border/50 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm backdrop-blur-md">
              <ShieldCheck size={14} className="text-primary animate-pulse" /> Global Community network
            </div>

            <h1 className="text-foreground text-5xl md:text-[6.5rem] font-black tracking-tighter mb-12 leading-[0.85] italic">
               Verified <br className="hidden md:block" /> <span className="text-luxury">Communities.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-medium leading-relaxed opacity-90 border-l-4 border-primary/20 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
               Explore trusted matrimony groups managed by verified community leaders. 
               Safe, authentic, and culturally relevant matches simplified by trust.
            </p>
          </div>
        </div>

        {/* List Section - Adjusted Margin for smooth transition */}
        <div className="max-w-7xl mx-auto px-4 -mt-24 pb-20 relative z-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communities.length > 0 ? communities.map((community) => (
                <div key={community.uid} className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group border-b-4 border-b-primary/0 hover:border-b-primary flex flex-col">
                   <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl text-slate-700 font-bold transition-all"
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
