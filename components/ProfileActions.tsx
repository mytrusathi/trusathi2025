"use client";

import React, { useState, useEffect } from 'react';
import { Printer, Heart, ExternalLink, ShieldCheck, Loader2, Phone, MessageSquare, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, deleteDoc, limit } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import { sendNotification } from '@/app/lib/notification-service';

interface ProfileActionsProps {
  profile: Profile;
  managerName?: string;
}

interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

export default function ProfileActions({ profile, managerName }: ProfileActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [revealedContact, setRevealedContact] = useState<string | null>(null);
  const [fetchingContact, setFetchingContact] = useState(false);

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

  useEffect(() => {
    const fetchPrivateContact = async () => {
      if (interestSent && profile.revealContactOnInterest && profile.id) {
        setFetchingContact(true);
        try {
          const privateDoc = await getDoc(doc(db, 'profile_private', profile.id));
          if (privateDoc.exists()) {
            setRevealedContact(privateDoc.data().contact);
          }
        } catch (err) {
          console.error("Failed to fetch private contact:", err);
        } finally {
          setFetchingContact(false);
        }
      }
    };
    fetchPrivateContact();
  }, [interestSent, profile.revealContactOnInterest, profile.id]);

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

      const receiverId = profile.createdBy || 'system_admin';

      if (user.uid === profile.createdBy) {
        alert("You cannot send an interest to your own profile.");
        return;
      }

      const senderProfileQuery = query(collection(db, 'profiles'), where('createdBy', '==', user.uid), limit(1));
      const senderProfileSnap = await getDocs(senderProfileQuery);
      const senderProfile = !senderProfileSnap.empty ? senderProfileSnap.docs[0].data() : null;

      await addDoc(collection(db, 'interests'), {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous User',
        senderProfileId: !senderProfileSnap.empty ? senderProfileSnap.docs[0].id : null,
        senderProfileName: senderProfile?.name || user.displayName || 'Anonymous User',
        senderProfileImage: senderProfile?.imageUrl || '',
        receiverId: receiverId,
        profileId: profile.id,
        profileNo: profile.profileNo || 'Unknown',
        profileName: profile.name,
        profileImage: profile.imageUrl || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

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
    } catch (error: unknown) {
      console.error("Interest failed:", error);
      const firebaseError = error as FirebaseErrorLike;
      if (firebaseError.code === 'permission-denied') {
        alert("Permission Denied: Your account may need approval or completion. Please check your dashboard.");
      } else {
        alert(`Error: ${firebaseError.message || 'Could not send interest'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const canSeeContact = interestSent && profile.revealContactOnInterest;

  // Professional fallback for manager name
  const effectiveManagerName = (!managerName || managerName.toLowerCase() === 'self') ? 'the curator' : managerName;

  return (
    <div className="space-y-8">
      {/* Branding for PDF/Print */}
      <div className="print-only mb-12 border-b-2 border-slate-900 pb-8">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">TruSathi</h1>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Service to Mankind</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">Matchmaking Vision</p>
              <p className="text-xs font-bold text-slate-700 max-w-[200px]">An authentic, secure, and free matchmaking service dedicated to building a better society.</p>
            </div>
        </div>
      </div>

      {/* Capture Portfolio Button - Integrated better */}
      <div className="no-print">
         <button 
           onClick={handlePrint}
           className="w-full px-6 py-3.5 bg-background border border-border hover:border-primary/20 hover:bg-primary/5 text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-sm border-dashed"
         >
            <Printer size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" /> 
            <span>Capture Portfolio / PDF</span>
         </button>
      </div>

      {/* Main Connection Card */}
      <div className={`rounded-[2.5rem] p-7 md:p-10 no-print shadow-2xl transition-all duration-700 relative overflow-hidden group border border-white/5 ${
        interestSent ? (canSeeContact ? 'bg-slate-900' : 'bg-[#A4161A]/90') : 'bg-[#A4161A]'
      }`}>
          {/* Subtle Imperial Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldCheck size={14} className="text-white/40" />
                 <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/50">Safe Introduction</span>
              </div>
              <h4 className="text-white font-black text-2xl md:text-3xl tracking-tight leading-tight font-serif italic">
                {interestSent ? (canSeeContact ? "Match Verified" : "Request Sent") : "Connect with this Candidate?"}
              </h4>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                 {interestSent 
                   ? (canSeeContact 
                      ? "Family and contact details are now revealed." 
                      : `Your interest is with ${effectiveManagerName}.`) 
                   : (profile.revealContactOnInterest 
                      ? `Get instant access to contact details.` 
                      : `Request a secure introduction via ${effectiveManagerName}.`)}
              </p>
            </div>

            {!interestSent ? (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="w-full font-black py-4 md:py-6 px-6 bg-accent text-accent-foreground rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1 group/btn uppercase tracking-[0.25em] text-[10px]"
              >
                  {loading ? <Loader2 className="animate-spin text-white" /> : (
                    <>
                      <span className="text-white/80 font-medium normal-case tracking-normal text-xs mb-1">Secure & Fast Connection</span>
                      <div className="flex items-center gap-2">
                        {user ? "Send Interest" : "Sign in to Connect"} 
                        <ExternalLink size={16} className="text-white/50 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
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
                               <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-1">Direct Contact Detail</p>
                               {fetchingContact ? (
                                 <Loader2 size={24} className="animate-spin text-white/20" />
                               ) : (
                                 <p className="font-black text-3xl text-white tracking-widest">{revealedContact || 'SECURE_HIDDEN'}</p>
                               )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <a 
                               href={`https://wa.me/${revealedContact?.replace(/\D/g, '') || ''}`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className={`px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all ${!revealedContact ? 'opacity-50 pointer-events-none' : ''}`}
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
                             <MessageSquare size={16} /> Secure Chat
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
                        <h5 className="font-black text-xl uppercase tracking-tight">Review in Progress</h5>
                        <p className="text-sm font-medium leading-relaxed text-white/60 max-w-xs">
                           Waiting for {effectiveManagerName} to approve your connect request. This usually takes 1-4 hours.
                        </p>
                     </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                   <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Verified Authenticated</span>
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
        alert("Please login as a member to shortlist profiles.");
        return;
      }
      if (!profileId) return;

      if (user.uid === profile.createdBy) {
        alert("You cannot shortlist your own profile.");
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

          try {
             if (profile.createdBy && profile.createdBy !== user.uid) {
                await sendNotification({
                   recipientId: profile.createdBy,
                   senderId: user.uid,
                   senderName: user.displayName || 'A Member',
                   type: 'favorite',
                   title: 'Profile Shortlisted',
                   message: `Someone has shortlisted profile ${profile.profileNo || 'your profile'}.`,
                   link: user.role === 'member' ? '/dashboard/member?view=favorites' : '/dashboard/group-admin'
                });
             }
          } catch (notifErr) {
             console.warn("Notification for favorite failed:", notifErr);
          }
        }
      } catch (error: unknown) {
        console.error("Favorite toggle failed:", error);
        const firebaseError = error as FirebaseErrorLike;
        if (firebaseError.code === 'permission-denied') {
           alert("Permission Denied: Your account may need approval or completion. Please check your dashboard.");
        } else {
           alert(`Error: ${firebaseError.message || 'Could not update shortlist'}`);
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
