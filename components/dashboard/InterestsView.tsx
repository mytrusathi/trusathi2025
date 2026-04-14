"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
    const fetchInterests = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        let fetched: Interest[] = [];
        
        if (type === 'connects') {
          // Query both sent and received that are accepted
          const qSent = query(collection(db, 'interests'), where('senderId', '==', user.uid), where('status', '==', 'accepted'));
          const qReceived = query(collection(db, 'interests'), where('receiverId', '==', user.uid), where('status', '==', 'accepted'));
          
          const [snapSent, snapReceived] = await Promise.all([getDocs(qSent), getDocs(qReceived)]);
          
          const results = [
            ...snapSent.docs.map(doc => ({ ...doc.data(), id: doc.id } as Interest)),
            ...snapReceived.docs.map(doc => ({ ...doc.data(), id: doc.id } as Interest))
          ];
          fetched = results;
        } else {
          // Query sent or received
          const interestsQuery = query(
            collection(db, 'interests'),
            where(type === 'sent' ? 'senderId' : 'receiverId', '==', user.uid)
          );
          const snap = await getDocs(interestsQuery);
          fetched = snap.docs
            .map((interestDoc) => ({ ...interestDoc.data(), id: interestDoc.id } as Interest))
            // Filter out accepted from sent/received views as they have their own section now
            .filter(i => i.status !== 'accepted');
        }

        const sorted = fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInterests(sorted);
      } catch (err) {
        console.error('Interest Fetch Error:', err);
        setError('Failed to load interests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [user, type]);

  const handleAction = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setPendingActionId(id);
    try {
      await updateDoc(doc(db, 'interests', id), { status: newStatus });
      setInterests((prev) => prev.map((interest) => (
        interest.id === id ? { ...interest, status: newStatus } : interest
      )));
    } catch (err) {
      console.error(err);
    } finally {
      setPendingActionId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this interest request?')) return;

    setPendingActionId(id);
    try {
      await deleteDoc(doc(db, 'interests', id));
      setInterests((prev) => prev.filter((interest) => interest.id !== id));
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
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="text-slate-500 font-medium text-sm">Loading interests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Could Not Load Interests</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-7 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const connected = interests.filter(i => i.status === 'accepted');
  const others = interests.filter(i => i.status !== 'accepted');

  if (interests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-slate-300">
          {type === 'sent' ? <Send size={24} /> : <Inbox size={24} />}
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No {type === 'sent' ? 'Sent' : 'Received'} Interests Yet
        </h3>
        <p className="text-slate-400 text-sm">Your activity will appear here once you start connecting.</p>
      </div>
    );
  }

  const renderInterestList = (list: Interest[]) => (
    <div className="space-y-3">
      {list.map((interest) => {
        // In 'connects' mode, we need to determine if we were the sender or receiver
        // to show the 'other' person's profile
        const isWeSender = interest.senderId === user?.uid;
        
        // Resolve which profile to show in the header
        const displayImage = (!isWeSender) 
          ? (interest.senderProfileImage || '') 
          : interest.profileImage;
        
        const displayName = (!isWeSender)
          ? (interest.senderProfileName || interest.senderName)
          : interest.profileName;

        const displayLink = (!isWeSender)
          ? (interest.senderProfileId ? `/profile/${interest.senderProfileId}` : null)
          : `/profile/${interest.profileId}`;

        const otherId = isWeSender ? interest.receiverId : interest.senderId;

        return (
          <div
            key={interest.id}
            className={`bg-white rounded-2xl border transition-all duration-200 ${
              interest.status === 'accepted' 
                ? 'border-emerald-100 shadow-sm shadow-emerald-50 hover:border-emerald-200' 
                : 'border-slate-100 hover:border-indigo-100 hover:shadow-md'
            }`}
          >
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                {displayImage ? (
                  <Image src={displayImage} alt={displayName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-bold">
                    No Photo
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-slate-900 text-[15px] truncate">{displayName}</h4>
                  {interest.profileNo && type === 'sent' && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wide shrink-0">
                      {interest.profileNo}
                    </span>
                  )}
                  {interest.status === 'accepted' && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-[0.2em] shrink-0 border border-emerald-100">
                      Connected
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-2 leading-snug">
                  {type === 'sent'
                    ? (interest.status === 'accepted' ? 'You are now connected with this candidate.' : 'You expressed interest in this candidate.')
                    : (interest.status === 'accepted' ? 'Connection accepted. You can now start chatting!' : `Interest received from ${interest.senderProfileName || interest.senderName}.`)}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    interest.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : interest.status === 'accepted'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      interest.status === 'pending'
                        ? 'bg-amber-400'
                        : interest.status === 'accepted'
                          ? 'bg-green-500'
                          : 'bg-rose-400'
                    }`} />
                    {interest.status === 'pending' ? 'Pending' : interest.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(interest.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {(displayLink && (interest.status === 'accepted' || type === 'sent')) && (
                  <Link
                    href={displayLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
                  >
                    View Biography <ExternalLink size={13} />
                  </Link>
                )}

                {type === 'received' && interest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(interest.id, 'accepted')}
                      disabled={pendingActionId === interest.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm whitespace-nowrap disabled:opacity-70"
                    >
                      {pendingActionId === interest.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Accept
                    </button>
                    <button
                      onClick={() => handleAction(interest.id, 'rejected')}
                      disabled={pendingActionId === interest.id}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all disabled:opacity-70"
                      title="Decline"
                    >
                      {pendingActionId === interest.id ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                    </button>
                  </>
                )}

                {type === 'sent' && interest.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(interest.id)}
                    disabled={pendingActionId === interest.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-sm transition-all whitespace-nowrap disabled:opacity-70"
                  >
                    {pendingActionId === interest.id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                    Cancel Interest
                  </button>
                )}
                
                {interest.status === 'accepted' && (
                  <Link
                    href={`/dashboard/member?view=chats&chat=${otherId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
                  >
                    Start Chat <Inbox size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderInterestList(interests)}
    </div>
  );
}
