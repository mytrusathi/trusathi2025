"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
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
        // Single-field query only — no composite index required in Firestore
        const q = query(
          collection(db, 'interests'),
          where(type === 'sent' ? 'senderId' : 'receiverId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs
          .map(d => ({ ...d.data(), id: d.id } as Interest))
          // Sort newest-first on the client
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInterests(fetched);
      } catch (err: any) {
        console.error('Interest Fetch Error:', err);
        setError('Failed to load interests. Please try again.');
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

  /* ---------- States ---------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="text-slate-500 font-medium text-sm">Loading interests…</p>
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

  /* ---------- List ---------- */
  return (
    <div className="space-y-3">
      {interests.map((interest) => (
        <div
          key={interest.id}
          className="bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Avatar */}
            <div className="w-14 h-14 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
              {interest.profileImage ? (
                <Image src={interest.profileImage} alt={interest.profileName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-bold">
                  No Photo
                </div>
              )}
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h4 className="font-bold text-slate-900 text-[15px] truncate">{interest.profileName}</h4>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wide shrink-0">
                  {interest.profileNo}
                </span>
              </div>

              <p className="text-sm text-slate-500 mb-2 leading-snug">
                {type === 'sent'
                  ? 'You expressed interest in this candidate.'
                  : `Interest received from ${interest.senderName}.`}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  interest.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : interest.status === 'accepted'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    interest.status === 'pending' ? 'bg-amber-400' :
                    interest.status === 'accepted' ? 'bg-green-500' : 'bg-rose-400'
                  }`} />
                  {interest.status === 'pending' ? 'Pending' : interest.status === 'accepted' ? 'Accepted' : 'Declined'}
                </span>

                {/* Date */}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(interest.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/profile/${interest.profileId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
              >
                View Profile <ExternalLink size={13} />
              </Link>

              {type === 'received' && interest.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAction(interest.id, 'accepted')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(interest.id, 'rejected')}
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all"
                    title="Decline"
                  >
                    <X size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
