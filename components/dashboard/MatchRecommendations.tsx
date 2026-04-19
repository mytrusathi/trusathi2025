"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import PublicProfileCard from '../PublicProfileCard';
import { Loader2, Sparkles, ArrowRight, Heart, SlidersHorizontal, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Preferences {
  ageMin: string;
  ageMax: string;
  community: string;
  maritalStatus: string;
}

interface MatchRecommendationsProps {
  userProfile: Profile | null;
}

export default function MatchRecommendations({ userProfile }: MatchRecommendationsProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPrefs, setHasPrefs] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      try {
        // 1. Fetch User's Preferences
        let prefs: Preferences | null = null;
        try {
          const prefSnap = await getDoc(doc(db, 'partner_preferences', user.uid));
          if (prefSnap.exists()) {
            prefs = prefSnap.data() as Preferences;
            setHasPrefs(true);
          } else {
            setHasPrefs(false);
          }
        } catch (prefErr) {
          console.error("Preferences fetch error:", prefErr);
        }
        
        // 2. Determine target gender from Prop
        const targetGender = (userProfile?.gender === 'male') ? 'female' : 'male';

        if (prefs) {
          const q = query(
            collection(db, 'profiles'), 
            where('isPublic', '==', true),
            where('gender', '==', targetGender),
            limit(100)
          );
          
          const snap = await getDocs(q);
          const filtered = snap.docs
            .map(d => ({ ...d.data(), id: d.id } as Profile))
            .filter(p => {
              const birthDate = new Date(p.dob);
              const age = new Date().getFullYear() - birthDate.getFullYear();
              const matchesAge = age >= parseInt(prefs!.ageMin) && age <= parseInt(prefs!.ageMax);
              const matchesCommunity = prefs!.community === 'Any' || p.religion === prefs!.community;
              const matchesMarital = prefs!.maritalStatus === 'Any' || p.maritalStatus === prefs!.maritalStatus;
              return matchesAge && matchesCommunity && matchesMarital && p.createdBy !== user.uid;
            })
            .slice(0, 6);

          setRecommendations(filtered);
        } else {
          // Fallback matches
          const q = query(
            collection(db, 'profiles'), 
            where('isPublic', '==', true),
            where('gender', '==', targetGender),
            limit(12)
          );
          const snap = await getDocs(q);
          const fallbackMatches = snap.docs
            .map(d => ({ ...d.data(), id: d.id } as Profile))
            .filter(p => p.createdBy !== user.uid)
            .slice(0, 6);
          setRecommendations(fallbackMatches);
        }
      } catch (err) {
        console.error("MatchRecommendations error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, userProfile]);

  if (loading) return (
    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 flex flex-col items-center justify-center space-y-4 shadow-sm">
       <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="text-rose-600" size={24} />
       </div>
       <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Filtering matches for you...</p>
    </div>
  );

  if (!userProfile) {
    return (
      <div className="bg-white rounded-[3rem] p-12 border border-dashed border-slate-200 text-center space-y-6">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <UserCircle2 size={32} strokeWidth={1} />
         </div>
         <div className="space-y-2">
            <h4 className="font-bold text-slate-800">Complete your profile</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Create your own biodata first to see personalized matchmaking suggestions.</p>
         </div>
         <Link 
           href="/dashboard/member?view=my-profiles"
           className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
         >
           Get Started
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles size={20} />
           </div>
           <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight uppercase">Suggested for You</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 {hasPrefs ? 'Based on your preferences' : 'Latest Profiles'}
              </p>
           </div>
        </div>
        <Link 
          href="/dashboard/member?view=partner-preferences" 
          className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
        >
          Refine Search <ArrowRight size={14} />
        </Link>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {recommendations.map(p => (
             <PublicProfileCard key={p.id} profile={p} />
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-12 border border-dashed border-slate-200 text-center space-y-6">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Heart size={32} />
           </div>
           <div className="space-y-2">
              <h4 className="font-bold text-slate-800">No exact matches yet</h4>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">Try broadening your partner preferences to see more recommendations.</p>
           </div>
           <Link 
             href="/dashboard/member?view=partner-preferences"
             className="inline-flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
           >
              Update Preferences
           </Link>
        </div>
      )}
    </div>
  );
}
