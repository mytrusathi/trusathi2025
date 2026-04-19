"use client";

import { useMemo } from 'react';
import { Profile } from '@/types/profile';
import { AppUser } from '@/types/appUser';

export interface AuthenticityPillar {
  id: string;
  label: string;
  points: number;
  earned: number;
  isMet: boolean;
  hint: string;
  view: string;
}

export function useAuthenticity(profile: Profile | null, user: AppUser | null) {
  return useMemo(() => {
    if (!profile) return { pillars: [], totalScore: 0, isMandatoryComplete: false };

    // 1. Profile Completeness (out of 20 points)
    const coreFields: (keyof Profile)[] = [
      'name', 'gender', 'dob', 'city', 'religion', 'caste',
      'education', 'profession', 'income', 'fatherName',
      'imageUrl', 'about', 'contact'
    ];
    const filledCount = coreFields.filter(f => !!profile[f]).length;
    const profilePoints = Math.round((filledCount / coreFields.length) * 20);

    // 2. Pillars Definition
    const pillars: AuthenticityPillar[] = [
      {
        id: 'phone',
        label: 'Mobile Authenticated',
        points: 20,
        earned: profile.phoneVerified || user?.phoneNumber ? 20 : 0,
        isMet: !!profile.phoneVerified || !!user?.phoneNumber,
        hint: 'Phone number registered and confirmed via OTP.',
        view: 'overview'
      },
      {
        id: 'email',
        label: 'Email Authenticated',
        points: 10,
        earned: profile.emailVerified || user?.emailVerified ? 10 : 0,
        isMet: !!profile.emailVerified || !!user?.emailVerified,
        hint: 'Email address verified for notifications.',
        view: 'overview'
      },
      {
        id: 'profile',
        label: 'Profile Complete',
        points: 20,
        earned: profilePoints,
        isMet: profilePoints >= 20,
        hint: `${filledCount} of ${coreFields.length} fields filled (${profilePoints}/20 pts).`,
        view: 'my-profiles'
      },
      {
        id: 'selfie',
        label: 'Selfie Uploaded',
        points: 25,
        earned: profile.selfieUrl ? 25 : 0,
        isMet: !!profile.selfieUrl,
        hint: 'A live selfie or profile photo has been uploaded.',
        view: 'my-profiles'
      },
      {
        id: 'admin',
        label: 'Team Verified',
        points: 25,
        earned: profile.adminApproved ? 25 : (profile.screeningStatus === 'pending' ? 12 : 0),
        isMet: !!profile.adminApproved,
        hint: profile.adminApproved ? 'Profile verified by truSathi Team.' : (profile.screeningStatus === 'pending' ? 'Review in progress...' : 'Submit to Team for screening.'),
        view: 'chats'
      }
    ];

    const totalScore = pillars.reduce((sum, p) => sum + p.earned, 0);
    
    // Mandatory for submission: Profile, Phone, Selfie
    const isMandatoryComplete = pillars
      .filter(p => ['profile', 'phone', 'selfie'].includes(p.id))
      .every(p => p.isMet);

    return { 
      pillars, 
      totalScore, 
      isMandatoryComplete,
      isProfileComplete: profilePoints >= 20
    };
  }, [profile, user]);
}
