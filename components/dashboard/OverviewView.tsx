"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Send, Inbox, Bell, Star, 
  MessageSquare, LayoutDashboard, ArrowRight,
  ShieldCheck, Sparkles, UserCircle2, Settings, AlertCircle, Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDoc, getDocs, onSnapshot, limit, doc } from 'firebase/firestore';
import Link from 'next/link';
import CompletenessMeter from './CompletenessMeter';
import MatchRecommendations from './MatchRecommendations';
import AuthenticityChecklist from './AuthenticityChecklist';
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
  const [mainProfile, setMainProfile] = useState<Profile | null>(null);
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

      if (!profileSnap.empty) {
        setMainProfile({ ...profileSnap.docs[0].data(), id: profileSnap.docs[0].id } as Profile);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch Stats & Check User Doc
    const fetchDashboardData = async () => {
      try {
        await fetchData();
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();

    // 2. Real-time Unread Notifications
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
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-4 text-rose-700 animate-pulse">
          <AlertCircle size={24} />
          <div>
            <p className="font-black uppercase text-xs tracking-widest">Registration Incomplete</p>
            <p className="text-sm font-medium">Your account data is missing. Please try logging out and logging in again, or contact support if the issue persists.</p>
          </div>
        </div>
      )}


      <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-rose-100/10 transition-all hover:shadow-rose-100/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-3">
               <h2 className="text-rose-600 font-black text-sm uppercase tracking-[0.2em]">{getTimeGreeting()}</h2>
               <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome back, <span className="text-rose-600">{user?.displayName?.split(' ')[0] || 'Member'}!</span>
               </h1>
               <p className="text-slate-500 font-medium text-lg">Your profile is the key to finding your TruSathi. Keep it updated!</p>
            </div>
            <div className="flex items-center bg-rose-50 p-2 rounded-full border border-rose-100">
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

      {/* Stats row removed as it moved to sidebar */}

      <MatchRecommendations />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Profile Focus */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
               <LayoutDashboard size={20} className="text-indigo-600" /> Quick Actions
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
                  href="/dashboard/member"
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

         {/* Sidebar Widgets */}
         <div className="space-y-8">
             <div className="space-y-4">
             <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-rose-200">
                <ShieldCheck className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-150 transition-transform duration-1000 rotate-12" size={180} />
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="text-rose-100" />
                  </div>
                  <h4 className="text-2xl font-black leading-tight tracking-tight">Your Journey to a TruSathi starts here.</h4>
                  <p className="text-rose-100/80 text-sm font-medium leading-relaxed">
                    We screen every profile meticulously to ensure a safe and genuine matchmaking environment. Trust the process.
                  </p>
                  <Link href="/search" className="inline-flex items-center gap-3 bg-white text-rose-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl shadow-rose-950/20">
                    Browse Profiles <ArrowRight size={14} />
                  </Link>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  href: string;
  color: string;
  isAlert?: boolean;
}

function StatCard({ icon, label, value, href, color, isAlert }: StatCardProps) {
   return (
      <Link href={href} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all group">
         <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
               {icon}
            </div>
            {isAlert && <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>}
         </div>
         <p className="text-3xl font-black text-slate-900 leading-none mb-1">{value}</p>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      </Link>
   );
}

interface ActionBoxProps {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
  accent: string;
}

function ActionBox({ icon, title, desc, href, accent }: ActionBoxProps) {
   return (
      <Link href={href} className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 transition-all flex items-start gap-4 group">
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
