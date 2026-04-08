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
    const fetchFavs = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const profileIds = snap.docs.map(d => d.data().profileId);
        
        if (profileIds.length === 0) {
          setProfiles([]);
          return;
        }

        const fetched: Profile[] = [];
        for (const id of profileIds) {
          const pSnap = await getDoc(doc(db, 'profiles', id));
          if (pSnap.exists()) {
            fetched.push({ ...pSnap.data(), id: pSnap.id } as Profile);
          }
        }
        setProfiles(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [user]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-rose-500" /></div>;

  if (profiles.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
         <Heart className="mx-auto text-slate-200 mb-6" size={48} />
         <h3 className="text-2xl font-black text-slate-800">No Favorites Yet</h3>
         <p className="text-slate-500 mt-2">Profiles you mark as favorite will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {profiles.map(p => <PublicProfileCard key={p.id} profile={p} />)}
    </div>
  );
}
