"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Profile } from '@/types/profile';

/**
 * Hook to determine if a profile's identity and sensitive data should be revealed.
 * Reveal logic:
 * 1. User is the creator of the profile.
 * 2. User is an admin (Super/Group) managing that group.
 * 3. User has an "accepted" interest connection with the profile.
 */
export function useProfileReveal(profile?: Profile) {
  const { user, role } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRevealStatus = async () => {
      if (!profile || !profile.id) {
        setIsRevealed(false);
        setLoading(false);
        return;
      }

      // 1. Unauthenticated users -> Masked
      if (!user) {
        setIsRevealed(false);
        setLoading(false);
        return;
      }

      // 2. Creator -> Revealed
      if (user.uid === profile.createdBy) {
        setIsRevealed(true);
        setLoading(false);
        return;
      }

      // 3. Admin -> Revealed if managing group (or Super Admin)
      if (role === 'super-admin') {
        setIsRevealed(true);
        setLoading(false);
        return;
      }
      
      if (role === 'group-admin' && user.groupName === profile.creatorGroupName) {
        setIsRevealed(true);
        setLoading(false);
        return;
      }

      // 4. Check for Accepted Interest (Sender or Receiver side)
      try {
        // Query to see if there is an accepted interest between user and this profile
        const q = query(
          collection(db, 'interests'),
          where('status', '==', 'accepted'),
          where('profileId', '==', profile.id)
        );
        
        const snap = await getDocs(q);
        const hasAccepted = snap.docs.some(doc => {
            const data = doc.data();
            return data.senderId === user.uid || data.receiverId === user.uid;
        });

        setIsRevealed(hasAccepted);
      } catch (err) {
        console.error("Reveal check error:", err);
        setIsRevealed(false);
      } finally {
        setLoading(false);
      }
    };

    checkRevealStatus();
  }, [user, role, profile]);

  return { isRevealed, loading };
}
