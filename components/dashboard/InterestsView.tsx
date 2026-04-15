"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Send, Inbox, Check, X, Clock, ExternalLink, AlertCircle, Ban } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Interest {
  id: string;
  senderId: string;
  senderName: string;
  senderProfileId?: string;
  senderProfileName?: string;
  senderProfileImage?: string;
  receiverId: string;
  profileId: string;
  profileNo: string;
  profileName: string;
  profileImage: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Props {
  type: 'sent' | 'received' | 'connects';
}

export default function InterestsView({ type }: Props) {
  const { user } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    let unsubscribes: (() => void)[] = [];

    try {
      if (type === 'connects') {
        const qSent = query(collection(db, 'interests'), where('senderId', '==', user.uid), where('status', '==', 'accepted'));
        const qReceived = query(collection(db, 'interests'), where('receiverId', '==', user.uid), where('status', '==', 'accepted'));

        const results: Record<string, Interest> = {};

        const unsubSent = onSnapshot(qSent, (snap) => {
          snap.docs.forEach(doc => { results[doc.id] = { ...doc.data(), id: doc.id } as Interest; });
          updateList();
        });

        const unsubReceived = onSnapshot(qReceived, (snap) => {
          snap.docs.forEach(doc => { results[doc.id] = { ...doc.data(), id: doc.id } as Interest; });
          updateList();
        });

        const updateList = () => {
          const sorted = Object.values(results).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setInterests(sorted);
          setLoading(false);
        };

        unsubscribes = [unsubSent, unsubReceived];
      } else {
        const interestsQuery = query(
          collection(db, 'interests'),
          where(type === 'sent' ? 'senderId' : 'receiverId', '==', user.uid)
        );

        const unsub = onSnapshot(interestsQuery, (snap) => {
          const fetched = snap.docs
            .map((interestDoc) => ({ ...interestDoc.data(), id: interestDoc.id } as Interest))
            .filter(i => i.status !== 'accepted')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setInterests(fetched);
          setLoading(false);
        }, (err) => {
          console.error('Interest Stream Error:', err);
          setError('Failed to sync interests.');
          setLoading(false);
        });

        unsubscribes = [unsub];
      }
    } catch (err) {
      console.error('Interest Initialization Error:', err);
      setError('Initializing interest view failed.');
      setLoading(false);
    }

    return () => unsubscribes.forEach(u => u());
  }, [user, type]);

  const handleAction = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setPendingActionId(id);
    try {
      // Security note: Rule hardened to only allow receiver to accept/reject
      await updateDoc(doc(db, 'interests', id), { 
        status: newStatus,
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      console.error("Action error:", err);
      alert("Unable to update interest status. Access denied.");
    } finally {
      setPendingActionId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this interest request?')) return;
    setPendingActionId(id);
    try {
      await deleteDoc(doc(db, 'interests', id));
    } catch (err) {
      console.error(err);
      alert('Unable to cancel this interest right now.');
    } finally {
      setPendingActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <Loader2 className="animate-spin text-rose-600" size={36} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing connection requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Connection Sync Failed</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-7 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-rose-600 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
          {type === 'sent' ? <Send size={28} /> : <Inbox size={28} />}
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">
          No {type === 'sent' ? 'Sent' : 'Received'} Interests
        </h3>
        <p className="text-slate-400 text-sm font-medium">Your activity will update automatically as connections occur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-4">
        {interests.map((interest) => {
          const isWeSender = interest.senderId === user?.uid;
          const displayImage = (!isWeSender) ? (interest.senderProfileImage || '') : interest.profileImage;
          const displayName = (!isWeSender) ? (interest.senderProfileName || interest.senderName) : interest.profileName;
          const displayLink = (!isWeSender)
            ? (interest.senderProfileId ? `/profile/${interest.senderProfileId}` : null)
            : `/profile/${interest.profileId}`;
          const otherId = isWeSender ? interest.receiverId : interest.senderId;

          return (
            <div
              key={interest.id}
              className={`bg-white rounded-[2rem] border transition-all duration-300 group ${
                interest.status === 'accepted' 
                  ? 'border-emerald-100 shadow-xl shadow-emerald-50 hover:border-emerald-300' 
                  : 'border-slate-100 hover:border-rose-100 hover:shadow-2xl hover:shadow-slate-200/50'
              }`}
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                  {displayImage ? (
                    <Image src={displayImage} alt={displayName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl font-black bg-slate-50">
                      {displayName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-black text-slate-900 text-lg tracking-tight truncate">{displayName}</h4>
                    {interest.status === 'accepted' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-[0.25em] border border-emerald-100">
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                    {type === 'sent'
                      ? (interest.status === 'accepted' ? 'Success! You are now connected.' : 'Your request is being reviewed by this candidate.')
                      : (interest.status === 'accepted' ? 'Wonderful! You are now open for conversation.' : `Expressed interest in your profile on ${new Date(interest.createdAt).toLocaleDateString()}.`)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                      interest.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : interest.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        interest.status === 'pending' ? 'bg-amber-400' : interest.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-400'
                      }`} />
                      {interest.status}
                    </span>

                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                      <Clock size={12} strokeWidth={2.5} />
                      {new Date(interest.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 sm:block sm:space-y-2">
                  <div className="flex gap-2">
                    {(displayLink && (interest.status === 'accepted' || type === 'sent')) && (
                      <Link
                        href={displayLink}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex-1 md:flex-none justify-center"
                      >
                        View Bio <ExternalLink size={12} />
                      </Link>
                    )}

                    {type === 'received' && interest.status === 'pending' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleAction(interest.id, 'accepted')}
                          disabled={pendingActionId === interest.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-70"
                        >
                          {pendingActionId === interest.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Accept
                        </button>
                        <button
                          onClick={() => handleAction(interest.id, 'rejected')}
                          disabled={pendingActionId === interest.id}
                          className="p-3 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-2xl transition-all disabled:opacity-70"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {type === 'sent' && interest.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(interest.id)}
                      disabled={pendingActionId === interest.id}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 text-rose-600 border border-slate-100 hover:border-rose-200 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-70"
                    >
                      {pendingActionId === interest.id ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
                      Cancel
                    </button>
                  )}
                  
                  {interest.status === 'accepted' && (
                    <Link
                      href={`/dashboard/member?view=chats&chat=${otherId}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-200"
                    >
                      Start Chat <Inbox size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
