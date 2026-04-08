"use client";

import React, { useState, useEffect } from 'react';
import { Printer, Heart, ExternalLink, ShieldCheck, Loader2, Check, Phone, Mail, MessageSquare } from 'lucide-react';
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
      try {
        const q = query(
          collection(db, 'interests'), 
          where('senderId', '==', user.uid), 
          where('profileId', '==', profile.id)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setInterestSent(true);
        }
      } catch (err) {
        console.error("Check interest error:", err);
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
      if (!profile.id) throw new Error("Invalid profile ID");

      // Use a fallback for createdBy if missing (legacy profiles)
      const receiverId = profile.createdBy || 'system_admin';

      await addDoc(collection(db, 'interests'), {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous User',
        receiverId: receiverId,
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
      alert("Registration Error: Please ensure your profile is fully set up. If the error persists, contact support.");
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
      <div className={`rounded-3xl p-8 no-print shadow-xl transition-all relative overflow-hidden group ${
        interestSent ? 'bg-emerald-600 shadow-emerald-100' : 'bg-indigo-600 shadow-indigo-100'
      }`}>
          <ShieldCheck size={120} className="absolute -bottom-6 -right-6 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h4 className="text-white font-black text-xl leading-tight">
                {interestSent ? "Interest Expressed!" : "Interest in this Profile?"}
              </h4>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                 {interestSent 
                   ? "As a verified member, you can now see the contact details below." 
                   : "Sending an interest reveals the contact information immediately."}
              </p>
            </div>

            {!interestSent ? (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="w-full font-black py-4 px-6 bg-white text-indigo-900 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 hover:bg-indigo-50"
              >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      {user ? "Send Interest Now" : "Login to Connect"} 
                      <ExternalLink size={18} />
                    </>
                  )}
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 animate-in zoom-in-95 duration-500">
                 <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                       <Phone size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Contact Number</p>
                       <p className="font-bold text-lg">{profile.contact || 'Contact Admin'}</p>
                    </div>
                 </div>
                 
                 <div className="pt-4 flex gap-2">
                    <a 
                      href={`https://wa.me/${profile.contact?.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all"
                    >
                       <MessageSquare size={14} /> WhatsApp
                    </a>
                    <button 
                      onClick={() => router.push('/dashboard/member?view=chats')}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all"
                    >
                       <Check size={14} /> Logged
                    </button>
                 </div>
              </div>
            )}
            
            <p className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">
                {interestSent ? "Direct Connection Active" : (user ? "Verified Member" : "Auth Required")}
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
        try {
          const favRef = doc(db, 'favorites', `${user.uid}_${profileId}`);
          const snap = await getDoc(favRef);
          setIsFav(snap.exists());
        } catch (err) {
          console.error("Check fav error:", err);
        }
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
        alert("Error updating favorites. Please try again.");
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
