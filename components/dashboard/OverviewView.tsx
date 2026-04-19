"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Star, MessageSquare, LayoutDashboard, ArrowRight,
  ShieldCheck, Sparkles, UserCircle2, Settings, AlertCircle,
  Users, CheckCircle2, Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDoc, getDocs, onSnapshot, limit, doc } from 'firebase/firestore';
import Link from 'next/link';
import MatchRecommendations from './MatchRecommendations';
import { Profile } from '@/types/profile';
import { ReactNode } from 'react';
import { StatCardSkeleton, MatchGridSkeleton } from './Skeleton';

interface OverviewViewProps {
  userProfile: Profile | null;
}

export default function OverviewView({ userProfile }: OverviewViewProps) {
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
      // 1. Audit user document existence (for safety)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setUserDocMissing(true);
      }

      // 2. Fetch stats efficiently with Promise.all
      const [sentSnap, receivedSnap, favSnap] = await Promise.all([
        getDocs(query(collection(db, 'interests'), where('senderId', '==', user.uid))),
        getDocs(query(collection(db, 'interests'), where('receiverId', '==', user.uid))),
        getDocs(query(collection(db, 'favorites'), where('userId', '==', user.uid))),
      ]);

      const sentInterests = sentSnap.docs.map(doc => doc.data());
      const receivedInterests = receivedSnap.docs.map(doc => doc.data());

      const activeSent = sentInterests.filter(i => i.status !== 'accepted').length;
      const activeReceived = receivedInterests.filter(i => i.status !== 'accepted').length;
      const connects = sentInterests.filter(i => i.status === 'accepted').length + 
                       receivedInterests.filter(i => i.status === 'accepted').length;

      setStats({
        sent: activeSent,
        received: activeReceived,
        connects: connects,
        shortlisted: favSnap.size,
        unreadNotifs: 0 // Handled by NotificationBell
      });
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <MatchGridSkeleton />
          </div>
          <div className="space-y-8">
             <div className="h-64 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm" />
             <div className="h-48 bg-slate-900 rounded-[2.5rem] animate-pulse shadow-2xl shadow-rose-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {userDocMissing && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
           <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
           <div className="space-y-1">
              <p className="text-amber-900 font-bold text-sm uppercase tracking-tight">Technical Profile Incomplete</p>
              <p className="text-amber-700 text-xs font-medium leading-relaxed">
                Your base account information is not fully synchronized. Please contact support if you experience navigation issues.
              </p>
           </div>
        </div>
      )}

      {/* Hero Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          icon={<Sparkles size={20} />} 
          label="Your Connects" 
          value={stats.connects} 
          color="bg-emerald-50 text-emerald-600"
          link="/dashboard/member?view=connects"
        />
        <StatCard 
          icon={<Heart size={20} />} 
          label="Interests Received" 
          value={stats.received} 
          color="bg-rose-50 text-rose-600"
          link="/dashboard/member?view=received-interests"
        />
        <StatCard 
          icon={<Star size={20} />} 
          label="Shortlisted" 
          value={stats.shortlisted} 
          color="bg-amber-50 text-amber-600"
          link="/dashboard/member?view=favorites"
        />
        <StatCard 
          icon={<MessageSquare size={20} />} 
          label="Pending Sent" 
          value={stats.sent} 
          color="bg-indigo-50 text-indigo-600"
          link="/dashboard/member?view=sent-interests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <MatchRecommendations userProfile={userProfile} />
        </div>
        
        <div className="space-y-8">
           <ActionBox 
             icon={<LayoutDashboard size={20} className="text-rose-600" />}
             title="Quick Actions"
             desc="Manage your search experience efficiently."
           >
             <div className="grid grid-cols-1 gap-2">
                <QuickLink icon={<CheckCircle2 size={14}/>} label="My Preference" href="/dashboard/member?view=partner-preferences" />
                <QuickLink icon={<Clock size={14}/>} label="View Interests" href="/dashboard/member?view=received-interests" />
                <QuickLink icon={<Star size={14}/>} label="Saved Profiles" href="/dashboard/member?view=favorites" />
                <QuickLink icon={<Users size={14}/>} label="Profile Stats" href="/dashboard/member?view=my-profiles" />
             </div>
           </ActionBox>

           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
              <ShieldCheck className="absolute -bottom-4 -right-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={160} />
              <div className="relative z-10 space-y-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck size={24} className="text-rose-400" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-black uppercase tracking-tight">Trust Verification</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Verified profiles attract 3x more genuine interest. Screened by the truSathi team.</p>
                 </div>
                 <Link href="/dashboard/member?view=my-profiles" className="inline-flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all pt-2">
                    Start Verification <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, link }: { icon: ReactNode, label: string, value: number, color: string, link: string }) {
  return (
    <Link href={link} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col justify-between h-full hover:-translate-y-1">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm font-black`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </Link>
  );
}

function ActionBox({ icon, title, desc, children }: { icon: ReactNode, title: string, desc: string, children: ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
           {icon}
        </div>
        <div>
           <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase leading-none mb-1">{title}</h4>
           <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase tracking-widest">{desc}</p>
        </div>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}

function QuickLink({ icon, label, href }: { icon: ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-rose-100 hover:bg-rose-50/30 transition-all group">
      <div className="flex items-center gap-3">
        <span className="text-slate-300 group-hover:text-rose-500 transition-colors">{icon}</span>
        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</span>
      </div>
      <ArrowRight size={14} className="text-slate-300 group-hover:text-rose-500 transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 font-black" />
    </Link>
  );
}
