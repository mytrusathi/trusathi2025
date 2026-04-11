"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/profile';
import PublicProfileCard from '@/components/PublicProfileCard';
import { Loader2, Heart } from 'lucide-react';

export default function FavoritesView() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlistedProfiles = async () => {
      if (!user) return;

      try {
        const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', user.uid));
        const snap = await getDocs(favoritesQuery);
        const profileIds = snap.docs.map((favoriteDoc) => favoriteDoc.data().profileId);

        if (profileIds.length === 0) {
          setProfiles([]);
          return;
        }

        const fetchedProfiles: Profile[] = [];
        for (const profileId of profileIds) {
          const profileSnap = await getDoc(doc(db, 'profiles', profileId));
          if (profileSnap.exists()) {
            fetchedProfiles.push({ ...profileSnap.data(), id: profileSnap.id } as Profile);
          }
        }

        setProfiles(fetchedProfiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistedProfiles();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <Heart className="mx-auto text-slate-200 mb-6" size={48} />
        <h3 className="text-2xl font-black text-slate-800">No Shortlisted Profiles Yet</h3>
        <p className="text-slate-500 mt-2">Profiles you shortlist will appear here for quick comparison later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {profiles.map((profile) => <PublicProfileCard key={profile.id} profile={profile} />)}
    </div>
  );
}
