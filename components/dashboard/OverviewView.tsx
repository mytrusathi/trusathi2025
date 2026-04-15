"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Star, MessageSquare, LayoutDashboard, ArrowRight,
  ShieldCheck, Sparkles, UserCircle2, Settings, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDoc, getDocs, onSnapshot, limit, doc } from 'firebase/firestore';
import Link from 'next/link';
import MatchRecommendations from './MatchRecommendations';
import { Profile } from '@/types/profile';
import { ReactNode } from 'react';

export default function OverviewView() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    connects: 0,
    shortlisted: 0,
    unreadNotifs: 0
  });
  const [loading, setLoading] = useState(true);
  const [userDocMissing, setUserDocMissing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setUserDocMissing(true);
      }

      const [sentSnap, receivedSnap, favSnap, profileSnap] = await Promise.all([
        getDocs(query(collection(db, 'interests'), where('senderId', '==', user.uid))),
        getDocs(query(collection(db, 'interests'), where('receiverId', '==', user.uid))),
        getDocs(query(collection(db, 'favorites'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'profiles'), where('createdBy', '==', user.uid), limit(1))),
      ]);

      const sentInterests = sentSnap.docs.map(doc => doc.data());
      const receivedInterests = receivedSnap.docs.map(doc => doc.data());

      const activeSent = sentInterests.filter(i => i.status !== 'accepted').length;
      const activeReceived = receivedInterests.filter(i => i.status !== 'accepted').length;
      const connects = sentInterests.filter(i => i.status === 'accepted').length + 
                       receivedInterests.filter(i => i.status === 'accepted').length;

      setStats(prev => ({
        ...prev,
        sent: activeSent,
        received: activeReceived,
        connects: connects,
        shortlisted: favSnap.size,
      }));
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchData();

    const notifQuery = query(
      collection(db, 'notifications'), 
      where('recipientId', '==', user.uid),
      where('isRead', '==', false)
    );
    const unsubscribeNotifs = onSnapshot(notifQuery, (snap) => {
      setStats(prev => ({ ...prev, unreadNotifs: snap.size }));
    });

    return () => unsubscribeNotifs();
  }, [fetchData, user]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2rem]"></div>)}
     </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {userDocMissing && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-4 text-rose-700">
          <AlertCircle size={24} />
          <div>
            <p className="font-black uppercase text-xs tracking-widest">Registration Incomplete</p>
            <p className="text-sm font-medium">Please update your profile details.</p>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-4">
               <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                  {getTimeGreeting()}, <span className="text-rose-600">{user?.displayName?.split(' ')[0] || 'Member'}!</span>
               </h1>
               <p className="text-slate-500 font-medium text-lg leading-relaxed">Your profile is the key to finding your TruSathi.</p>
            </div>
            <div className="flex items-center bg-rose-50/50 p-2.5 rounded-[2rem] border border-rose-100">
               {[1,2,3].map(i => (
                  <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-300 -ml-4 first:ml-0 shadow-lg">
                     <UserCircle2 size={24} />
                  </div>
               ))}
               <div className="w-14 h-14 rounded-full border-4 border-white bg-rose-600 flex items-center justify-center text-white font-black text-xs -ml-4 shadow-lg">
                  +1.2k
               </div>
            </div>
         </div>
      </div>

      <MatchRecommendations />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
               <LayoutDashboard size={20} className="text-rose-600" /> Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ActionBox 
                  icon={<MessageSquare size={24} />} 
                  title="Messaging Center" 
                  desc="Chat with your accepted connections"
                  href="/dashboard/member?view=chats"
                  accent="text-indigo-600 bg-indigo-50"
               />
               <ActionBox 
                  icon={<Star size={24} />} 
                  title="Match Criteria" 
                  desc="Update who you are looking for"
                  href="/dashboard/member?view=partner-preferences"
                  accent="text-amber-600 bg-amber-50"
               />
               <ActionBox 
                  icon={<ShieldCheck size={24} />} 
                  title="Authenticate Profile" 
                  desc="Ensure your details are accurate"
                  href="/dashboard/member?view=my-profiles"
                  accent="text-emerald-600 bg-emerald-50"
               />
               <ActionBox 
                  icon={<Settings size={24} />} 
                  title="Account Settings" 
                  desc="Privacy and security controls"
                  href="/dashboard/settings"
                  accent="text-slate-600 bg-slate-100"
               />
            </div>
         </div>

         <div className="space-y-4">
            <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
               <ShieldCheck className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-150 transition-transform duration-1000 rotate-12" size={180} />
               <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="text-rose-100" />
                  </div>
                  <h4 className="text-2xl font-black leading-tight tracking-tight">Your Journey starts here.</h4>
                  <p className="text-rose-100/80 text-sm font-medium leading-relaxed">
                    We screen every profile meticulously to ensure safety.
                  </p>
                  <Link href="/search" className="inline-flex items-center gap-3 bg-white text-rose-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl">
                    Browse Profiles <ArrowRight size={14} />
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ActionBox({ icon, title, desc, href, accent }: { icon: ReactNode, title: string, desc: string, href: string, accent: string }) {
   return (
      <Link href={href} className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-rose-100 transition-all flex items-start gap-4 group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent} group-hover:scale-110 transition-transform`}>
             {icon}
          </div>
          <div>
             <h4 className="font-black text-slate-800 text-sm mb-0.5">{title}</h4>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
          </div>
      </Link>
   );
}
