"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Send, Inbox, Check, X, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Interest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  profileId: string;
  profileNo: string;
  profileName: string;
  profileImage: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Props {
  type: 'sent' | 'received';
}

export default function InterestsView({ type }: Props) {
  const { user } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterests = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'interests'), 
          where(type === 'sent' ? 'senderId' : 'receiverId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ ...d.data(), id: d.id } as Interest));
        setInterests(fetched);
      } catch (err: any) {
        console.error("Interest Fetch Error:", err);
        if (err.message?.includes('index')) {
          setError("MATCHING_INDEX_REQUIRED");
        } else {
          setError("Failed to load interests. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, [user, type]);

  const handleAction = async (id: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'interests', id), { status: newStatus });
      setInterests(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Data...</p>
    </div>
  );

  if (error) {
    return (
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 text-center space-y-6 shadow-2xl shadow-indigo-100/20">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
           <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-slate-900">Connection Error</h3>
           <p className="text-slate-500 max-w-sm mx-auto font-medium">
              {error === 'MATCHING_INDEX_REQUIRED' 
                ? "The database interests index is still building or missing. Please contact support or retry in a few minutes." 
                : error}
           </p>
        </div>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Retry Connection</button>
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200">
         <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
            {type === 'sent' ? <Send size={32} /> : <Inbox size={32} />}
         </div>
         <h3 className="text-2xl font-black text-slate-800">No {type === 'sent' ? 'Sent' : 'Received'} Interests</h3>
         <p className="text-slate-500 font-medium mt-2">Your activity log is waiting for connections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {interests.map((interest) => (
        <div key={interest.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group">
           <div className="flex items-center gap-6 w-full">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-100 relative overflow-hidden shrink-0 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                 {interest.profileImage ? (
                   <Image src={interest.profileImage} alt={interest.profileName} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-black text-[10px] uppercase tracking-widest">No Image</div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="min-w-0 flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-black text-slate-900 text-xl tracking-tight truncate">{interest.profileName}</h4>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-[0.2em]">{interest.profileNo}</span>
                 </div>
                 <p className="text-sm text-slate-400 font-medium mb-4 leading-relaxed">
                    {type === 'sent' 
                      ? "You've expressed interest in connecting with this candidate." 
                      : `Highly interested inquiry received from ${interest.senderName}.`}
                 </p>
                 <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm ${
                       interest.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                       interest.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          interest.status === 'pending' ? 'bg-amber-400' :
                          interest.status === 'accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                       }`}></div>
                       {interest.status}
                    </span>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest flex items-center gap-1.5">
                       <Clock size={12} />
                       {new Date(interest.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Link 
                href={`/profile/${interest.profileId}`} 
                className="flex-1 md:flex-none px-6 py-4 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest border border-transparent hover:border-indigo-100"
              >
                 View Bio <ExternalLink size={14} />
              </Link>
              
              {type === 'received' && interest.status === 'pending' && (
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleAction(interest.id, 'accepted')}
                      className="flex-1 md:flex-none px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5"
                    >
                       Connect
                    </button>
                    <button 
                      onClick={() => handleAction(interest.id, 'rejected')}
                      className="flex-1 md:flex-none p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[11px] uppercase hover:bg-rose-100 transition-all"
                    >
                       <X size={18} />
                    </button>
                 </div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
}
