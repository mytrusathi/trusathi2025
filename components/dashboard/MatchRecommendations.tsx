"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import PublicProfileCard from '../PublicProfileCard';
import { Loader2, Sparkles, ArrowRight, Heart, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface Preferences {
  ageMin: string;
  ageMax: string;
  community: string;
  maritalStatus: string;
}

export default function MatchRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPrefs, setHasPrefs] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      try {
        console.log("DEBUG: Starting fetchMatches for UID:", user.uid);
        
        // 1. Fetch User's Preferences
        let prefs: Preferences | null = null;
        try {
          const prefSnap = await getDoc(doc(db, 'partner_preferences', user.uid));
          if (prefSnap.exists()) {
            prefs = prefSnap.data() as Preferences;
            setHasPrefs(true);
            console.log("DEBUG: Prefs found:", prefs);
          } else {
            console.log("DEBUG: No prefs found");
            setHasPrefs(false);
          }
        } catch (prefErr) {
          console.error("DEBUG: prefSnap fetch error:", prefErr);
        }
        
        // 2. Fetch User's Gender to show opposite gender
        let targetGender = 'female';
        try {
          const userProfileSnap = await getDocs(query(
            collection(db, 'profiles'), 
            where('createdBy', '==', user.uid), 
            limit(1)
          ));
          const userGender = userProfileSnap.docs[0]?.data()?.gender || 'male';
          targetGender = userGender === 'male' ? 'female' : 'male';
          console.log("DEBUG: User gender:", userGender, "Target gender:", targetGender);
        } catch (profileErr) {
          console.error("DEBUG: userProfileSnap fetch error:", profileErr);
        }

        if (prefs) {
          console.log("DEBUG: Fetching recommended matches...");
          try {
            const q = query(
              collection(db, 'profiles'), 
              where('isPublic', '==', true),
              where('gender', '==', targetGender),
              limit(100)
            );
            
            const snap = await getDocs(q);
            console.log("DEBUG: Matches snap size:", snap.size);
            
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
          } catch (matchErr) {
            console.error("DEBUG: Final match query error:", matchErr);
          }
        } else {
          console.log("DEBUG: Fetching fallback matches...");
          try {
            const q = query(
              collection(db, 'profiles'), 
              where('isPublic', '==', true),
              where('gender', '==', targetGender),
              limit(12)
            );
            const snap = await getDocs(q);
            console.log("DEBUG: Fallback snap size:", snap.size);
            const fallbackMatches = snap.docs
              .map(d => ({ ...d.data(), id: d.id } as Profile))
              .filter(p => p.createdBy !== user.uid)
              .slice(0, 6);
            setRecommendations(fallbackMatches);
          } catch (fallbackErr) {
            console.error("DEBUG: Fallback query error:", fallbackErr);
          }
        }
      } catch (err) {
        console.error("DEBUG: Generic MatchRecommendations error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (loading) return (
    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 flex flex-col items-center justify-center space-y-4 shadow-sm animate-pulse">
       <Loader2 className="animate-spin text-rose-600" size={32} />
       <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Finding matches...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles size={20} />
           </div>
           <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Suggested for You</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {hasPrefs ? 'Based on your preferences' : 'Latest Profiles'}
              </p>
           </div>
        </div>
        <Link 
          href="/dashboard/member?view=partner-preferences" 
          className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
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
             className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
           >
              <SlidersHorizontal size={16} /> Update Preferences
           </Link>
        </div>
      )}
    </div>
  );
}
