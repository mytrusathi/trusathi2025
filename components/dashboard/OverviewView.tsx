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

      {/* Safety Disclaimer Banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <Shield size={16} className="text-amber-600 shrink-0" />
        <p className="text-xs font-bold text-amber-700">
          <strong>Safety Notice:</strong> Apni safety ki zimmedari user ki khud ki hai. Always meet in public places and authenticate identities independently.{' '}
          <a href="/terms" className="underline hover:text-amber-900">Read our Terms</a>.
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-indigo-100/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
               <h2 className="text-indigo-600 font-black text-sm uppercase tracking-[0.2em]">{getTimeGreeting()}</h2>
               <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Member'}!
               </h1>
               <p className="text-slate-500 font-medium">Your profile is the key to finding your TruSathi. Keep it updated!</p>
            </div>
            <div className="flex -space-x-4">
               {[1,2,3].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-300">
                     <UserCircle2 size={32} />
                  </div>
               ))}
               <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  +1k
               </div>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <StatCard 
            icon={<Inbox className="text-indigo-500" />} 
            label="Received" 
            value={stats.received} 
            href="/dashboard/member?view=received-interests"
            color="bg-indigo-50"
         />
         <StatCard 
            icon={<Send className="text-emerald-500" />} 
            label="Sent" 
            value={stats.sent} 
            href="/dashboard/member?view=sent-interests"
            color="bg-emerald-50"
         />
         <StatCard 
            icon={<Heart className="text-rose-500" />} 
            label="Connects" 
            value={stats.connects} 
            href="/dashboard/member?view=connects"
            color="bg-emerald-50"
            isAlert={stats.connects > 0}
         />
         <StatCard 
            icon={<Star className="text-amber-500" />} 
            label="Shortlisted" 
            value={stats.shortlisted} 
            href="/dashboard/member?view=favorites"
            color="bg-amber-50"
         />
      </div>

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
                <h3 className="text-xl font-black text-slate-800 px-2">Authenticity Status</h3>
                {mainProfile ? (
                  <>
                    <CompletenessMeter profile={mainProfile} />
                    <AuthenticityChecklist profile={mainProfile} onProfileRefresh={fetchData} />
                  </>
                ) : (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 text-indigo-600">
                      <ShieldCheck size={24} />
                      <h4 className="font-black text-lg">Start Your Journey</h4>
                    </div>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      Complete your profile to unlock the Authenticity Score and start matching with verified members.
                    </p>
                    <Link 
                      href="/dashboard/member?view=my-profiles" 
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all"
                    >
                      Step 1: Create Profile <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
             </div>

            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
               <Sparkles className="absolute -top-4 -right-4 text-white/10 group-hover:scale-150 transition-transform duration-700" size={120} />
               <h4 className="text-xl font-black leading-tight">Finding a life partner is a journey.</h4>
               <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                  We screen every profile to make your search safe. Trust the process and keep your biodata updated.
               </p>
               <Link href="/search" className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest pt-2 group-hover:gap-4 transition-all">
                  Browse Profiles <ArrowRight size={14} />
               </Link>
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
