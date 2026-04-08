"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Send, Inbox, Check, X, Clock, ExternalLink } from 'lucide-react';
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

  useEffect(() => {
    const fetchInterests = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'interests'), 
          where(type === 'sent' ? 'senderId' : 'receiverId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ ...d.data(), id: d.id } as Interest));
        setInterests(fetched);
      } catch (err) {
        console.error(err);
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  if (interests.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            {type === 'sent' ? <Send size={32} /> : <Inbox size={32} />}
         </div>
         <h3 className="text-2xl font-black text-slate-800">No {type === 'sent' ? 'Sent' : 'Received'} Interests</h3>
         <p className="text-slate-500 mt-2">Activity will appear here when connections are attempted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {interests.map((interest) => (
        <div key={interest.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all">
           <div className="flex items-center gap-6 w-full">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 relative overflow-hidden shrink-0 border-4 border-white shadow-sm">
                 {interest.profileImage ? (
                   <Image src={interest.profileImage} alt={interest.profileName} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">Profile</div>
                 )}
              </div>
              <div className="min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-slate-900 truncate">{interest.profileName}</h4>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">{interest.profileNo}</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">
                    {type === 'sent' ? `Interest sent to ${interest.receiverId === user?.uid ? 'your own profile' : 'this candidate'}` : `Interest received from ${interest.senderName}`}
                 </p>
                 <div className="flex items-center gap-4 mt-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg flex items-center gap-1.5 ${
                       interest.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                       interest.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                       {interest.status === 'pending' ? <Clock size={12}/> : interest.status === 'accepted' ? <Check size={12}/> : <X size={12}/>}
                       {interest.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(interest.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <Link 
                href={`/profile/${interest.profileId}`} 
                className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
              >
                 View <ExternalLink size={14} />
              </Link>
              
              {type === 'received' && interest.status === 'pending' && (
                 <>
                    <button 
                      onClick={() => handleAction(interest.id, 'accepted')}
                      className="flex-1 md:flex-none p-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                       Accept <Check size={14} />
                    </button>
                    <button 
                      onClick={() => handleAction(interest.id, 'rejected')}
                      className="flex-1 md:flex-none p-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                    >
                       Decline <X size={14} />
                    </button>
                 </>
              )}
           </div>
        </div>
      ))}
    </div>
  );
}
