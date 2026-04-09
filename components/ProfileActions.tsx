"use client";

import React, { useState, useEffect } from 'react';
import { Printer, Heart, ExternalLink, ShieldCheck, Loader2, Check, Phone, Mail, MessageSquare, AlertCircle, Info, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import { sendNotification } from '@/app/lib/notification-service';

interface ProfileActionsProps {
  profile: Profile;
  managerName?: string;
}

export default function ProfileActions({ profile, managerName }: ProfileActionsProps) {
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

      // Prevent self-connect
      if (user.uid === profile.createdBy) {
        alert("You cannot send an interest to your own profile.");
        return;
      }

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

      // Send Notification
      await sendNotification({
        recipientId: receiverId,
        senderId: user.uid,
        senderName: user.displayName || 'A Member',
        type: 'interest',
        title: 'New Interest Received',
        message: `${user.displayName || 'A Member'} has expressed interest in profile ${profile.profileNo}.`,
        link: '/dashboard/member?view=received-interests'
      });

      setInterestSent(true);
    } catch (error: any) {
      console.error("Interest failed:", error);
      if (error.code === 'permission-denied') {
        alert("Permission Denied: Your account may need approval or completion. Please check your dashboard.");
      } else {
        alert(`Error: ${error.message || 'Could not send interest'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Logic: Reveal contact only if interestSent AND (AutoReveal ON or it's a self-managed profile)
  const canSeeContact = interestSent && profile.revealContactOnInterest;

  return (
    <div className="space-y-8">
      {/* Branding for PDF/Print - Visible only on Print via globals.css .print-only class */}
      <div className="print-only mb-12 border-b-2 border-slate-900 pb-8">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">TruSathi</h1>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Service to Mankind</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">Matchmaking Vision</p>
              <p className="text-xs font-bold text-slate-700 max-w-[200px]">A verified, secure, and free matchmaking service dedicated to building a better society.</p>
            </div>
        </div>
      </div>

      {/* Print Button Wrapper */}
      <div className="flex justify-end no-print">
         <button 
           onClick={handlePrint}
           className="px-8 py-4 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-sm"
         >
            <Printer size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> 
            <span>Capture Portfolio / PDF</span>
         </button>
      </div>

      {/* Main Connect Action Card */}
      <div className={`rounded-[3.5rem] p-10 no-print shadow-2xl transition-all duration-700 relative overflow-hidden group ${
        interestSent ? (canSeeContact ? 'bg-slate-900' : 'bg-slate-800') : 'bg-indigo-600'
      }`}>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={20} className="text-white/40" />
                 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50">Secure Matchmaking</span>
              </div>
              <h4 className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none">
                {interestSent ? (canSeeContact ? "Connection Established" : "Requested Access") : "Forge a Connection?"}
              </h4>
              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                 {interestSent 
                   ? (canSeeContact 
                      ? "Direct communication is now authorized. You can view private details below." 
                      : `Access request has been safely dispatched to ${managerName || 'the Admin'} for verification.`) 
                   : (profile.revealContactOnInterest 
                      ? `Accessing this profile will reveal verified contact details immediately.` 
                      : `A formal interest notifies ${managerName || 'the Admin'} to facilitate a secure introduction.`)}
              </p>
            </div>

            {!interestSent ? (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="w-full font-black py-6 px-8 bg-white text-indigo-900 rounded-[2.5rem] transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-4 hover:bg-slate-50 uppercase tracking-[0.2em] text-xs"
              >
                  {loading ? <Loader2 className="animate-spin text-indigo-600" /> : (
                    <>
                      {user ? "Dispatch Interest Now" : "Authorize to Connect"} 
                      <ExternalLink size={20} className="text-indigo-400" />
                    </>
                  )}
              </button>
            ) : (
              <div className="space-y-6">
                {canSeeContact ? (
                  <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                              <Phone size={24} className="text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-1">Direct Contact Agent</p>
                              <p className="font-black text-3xl text-white tracking-widest">{profile.contact || 'SECURE_HIDDEN'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <a 
                              href={`https://wa.me/${profile.contact?.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all"
                           >
                              <MessageSquare size={16} /> WhatsApp
                           </a>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                           <div className="text-center md:text-left">
                              <p className="text-white font-black text-sm mb-1 uppercase tracking-tight">Stay within TruSathi?</p>
                              <p className="text-indigo-200/50 text-xs font-medium">Keep your conversations secure on our platform.</p>
                           </div>
                           <button 
                             onClick={() => router.push('/dashboard/member?view=chats')}
                             className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20"
                           >
                             <MessageSquare size={16} /> Secure Chat Platform
                           </button>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center gap-6 text-white animate-in slide-in-from-bottom-4 duration-700">
                     <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0 border border-amber-500/20">
                        <Clock size={28} className="text-amber-400 animate-pulse" />
                     </div>
                     <div className="space-y-2">
                        <h5 className="font-black text-xl uppercase tracking-tight">Verification in Progress</h5>
                        <p className="text-sm font-medium leading-relaxed text-white/60 max-w-xs">
                           Waiting for {managerName || 'the Admin'} to approve your profile access. High-priority connections usually take 1-4 hours.
                        </p>
                     </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                   <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Verified Secure</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Privacy Shield</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export function FavoriteButton({ profile }: { profile: Profile }) {
    const { user } = useAuth();
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);
    const profileId = profile.id;

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

      // Prevent self-favorite
      if (user.uid === profile.createdBy) {
        alert("You cannot add your own profile to favorites.");
        return;
      }

      setLoading(true);
      const favRef = doc(db, 'favorites', `${user.uid}_${profileId}`);
      try {
        if (isFav) {
          await deleteDoc(favRef);
          setIsFav(false);
        } else {
          const favoriteData = {
            userId: user.uid,
            profileId,
            profileNo: profile.profileNo || '',
            profileName: profile.name || '',
            createdAt: new Date().toISOString()
          };

          await setDoc(favRef, favoriteData);
          setIsFav(true);

          // Notify owner (Background - don't block UI if it fails)
          try {
             if (profile.createdBy && profile.createdBy !== user.uid) {
                await sendNotification({
                   recipientId: profile.createdBy,
                   senderId: user.uid,
                   senderName: user.displayName || 'A Member',
                   type: 'favorite',
                   title: 'Profile Favorited',
                   message: `Someone has added profile ${profile.profileNo || 'your profile'} to their favorites.`,
                   link: user.role === 'member' ? '/dashboard/member?view=favorites' : '/dashboard/group-admin'
                });
             }
          } catch (notifErr) {
             console.warn("Notification for favorite failed:", notifErr);
          }
        }
      } catch (error: any) {
        console.error("Favorite toggle failed:", error);
        if (error.code === 'permission-denied') {
           alert("Permission Denied: Your account may need approval or completion. Please check your dashboard.");
        } else {
           alert(`Error: ${error.message || 'Could not update favorites'}`);
        }
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
