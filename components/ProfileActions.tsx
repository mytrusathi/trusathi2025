"use client";

import React, { useState, useEffect } from 'react';
import { Printer, Heart, ExternalLink, ShieldCheck, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Profile } from '@/types/profile';

interface ProfileActionsProps {
  profile: Profile;
}

export default function ProfileActions({ profile }: ProfileActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  useEffect(() => {
    const checkInterest = async () => {
      if (!user || !profile.id) return;
      const q = query(
        collection(db, 'interests'), 
        where('senderId', '==', user.uid), 
        where('profileId', '==', profile.id)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setInterestSent(true);
      }
    };
    checkInterest();
  }, [user, profile.id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleConnect = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (interestSent) return;

    setLoading(true);
    try {
      if (!profile.id || !profile.createdBy) throw new Error("Invalid profile data");

      await addDoc(collection(db, 'interests'), {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous User',
        receiverId: profile.createdBy,
        profileId: profile.id,
        profileNo: profile.profileNo || 'Unknown',
        profileName: profile.name,
        profileImage: profile.imageUrl || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setInterestSent(true);
    } catch (error) {
      console.error("Interest failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Button Wrapper */}
      <div className="flex justify-end no-print">
         <button 
           onClick={handlePrint}
           className="w-full md:w-auto px-6 py-3 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
         >
            <Printer size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> 
            <span>Print / Save PDF</span>
         </button>
      </div>

      {/* Main Connect Action Card */}
      <div className="bg-indigo-600 rounded-3xl p-8 no-print shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <ShieldCheck size={120} className="absolute -bottom-6 -right-6 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h4 className="text-white font-black text-xl leading-tight">Interest in this Profile?</h4>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
                 {user 
                   ? (interestSent ? "You have expressed interest in this profile." : "Sending an interest is the first step towards a meaningful connection.") 
                   : "Log in to view contact details or express interest in this verified match."}
              </p>
            </div>

            <button 
              onClick={handleConnect}
              disabled={loading || interestSent}
              className={`w-full font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                interestSent 
                ? "bg-emerald-500 text-white cursor-default shadow-emerald-900/20" 
                : "bg-white text-indigo-900 hover:bg-indigo-50"
              }`}
            >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    {interestSent ? "Interest Sent" : (user ? "Send Interest Now" : "Login to Connect")} 
                    {interestSent ? <Check size={18} /> : <ExternalLink size={18} />}
                  </>
                )}
            </button>
            
            <p className="text-center text-[10px] text-indigo-200 font-bold uppercase tracking-widest leading-none">
                {user ? "Verified Member" : "Auth Required"}
            </p>
          </div>
      </div>
    </div>
  );
}

export function FavoriteButton({ profileId }: { profileId?: string }) {
    const { user } = useAuth();
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const checkFav = async () => {
        if (!user || !profileId) return;
        const favRef = doc(db, 'favorites', `${user.uid}_${profileId}`);
        const snap = await getDoc(favRef);
        setIsFav(snap.exists());
      };
      checkFav();
    }, [user, profileId]);

    const toggleFavorite = async () => {
      if (!user) {
        alert("Please login as a member to save favorites.");
        return;
      }
      if (!profileId) return;

      setLoading(true);
      const favRef = doc(db, 'favorites', `${user.uid}_${profileId}`);
      try {
        if (isFav) {
          await deleteDoc(favRef);
          setIsFav(false);
        } else {
          await setDoc(favRef, {
            userId: user.uid,
            profileId,
            createdAt: new Date().toISOString()
          });
          setIsFav(true);
        }
      } catch (error) {
        console.error("Favorite toggle failed", error);
      } finally {
        setLoading(false);
      }
    };

    return (
        <button 
          onClick={toggleFavorite}
          disabled={loading}
          className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all shadow-xl ${
            isFav 
            ? "bg-rose-500 border-rose-400 text-white" 
            : "bg-white/20 border-white/30 text-white hover:bg-rose-500 hover:border-rose-400"
          }`}
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={20} className={isFav ? "fill-white" : ""} />}
        </button>
    );
}
