"use client";
import React from 'react';
import { Profile } from '@/types/profile';
import { CheckCircle2, Phone, User, Camera, ShieldCheck, Info } from 'lucide-react';

interface Props {
  profile: Profile;
}

interface Pillar {
  icon: React.ReactNode;
  label: string;
  points: number;
  earned: number;
  met: boolean;
  hint: string;
}

export default function CompletenessMeter({ profile }: Props) {
  // --- Profile Completeness (out of 20 points) ---
  const coreFields: (keyof Profile)[] = [
    'name', 'gender', 'dob', 'city', 'religion', 'caste',
    'education', 'profession', 'income', 'fatherName',
    'imageUrl', 'about', 'contact'
  ];
  const filledCount = coreFields.filter(f => !!profile[f]).length;
  const profilePoints = Math.round((filledCount / coreFields.length) * 20);

  // --- 4 Pillars ---
  const pillars: Pillar[] = [
    {
      icon: <Phone size={16} />,
      label: 'Phone Verified',
      points: 20,
      earned: profile.phoneVerified ? 20 : 0,
      met: !!profile.phoneVerified,
      hint: 'Phone number registered and verified via OTP.',
    },
    {
      icon: <User size={16} />,
      label: 'Profile Complete',
      points: 20,
      earned: profilePoints,
      met: profilePoints >= 20,
      hint: `${filledCount} of ${coreFields.length} fields filled (${profilePoints}/20 pts).`,
    },
    {
      icon: <Camera size={16} />,
      label: 'Selfie Uploaded',
      points: 30,
      earned: profile.selfieUrl ? 30 : 0,
      met: !!profile.selfieUrl,
      hint: 'A live selfie or profile photo has been uploaded.',
    },
    {
      icon: <ShieldCheck size={16} />,
      label: 'Admin Screened',
      points: 30,
      earned: profile.adminApproved ? 30 : 0,
      met: !!profile.adminApproved,
      hint: 'Profile has been manually reviewed and approved by a Group Admin.',
    },
  ];

  const totalScore = pillars.reduce((sum, p) => sum + p.earned, 0);

  const getScoreColor = () => {
    if (totalScore < 40) return { bar: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Getting Started' };
    if (totalScore < 70) return { bar: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Building Trust' };
    if (totalScore < 100) return { bar: 'bg-indigo-500', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Almost There' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Highly Authentic' };
  };

  const colors = getScoreColor();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-600" />
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Authenticity Score</h4>
        </div>
        <div className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${colors.badge}`}>
          {totalScore}/100
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${colors.bar}`}
            style={{ width: `${totalScore}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-xs font-bold ${colors.text}`}>{colors.label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{totalScore}% complete</p>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-2 gap-2">
        {pillars.map((p) => (
          <div
            key={p.label}
            title={p.hint}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
              p.met
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <div className={`shrink-0 ${p.met ? 'text-emerald-600' : 'text-slate-300'}`}>
              {p.met ? <CheckCircle2 size={14} /> : p.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate leading-tight">{p.label}</p>
              <p className={`text-[9px] font-black uppercase ${p.met ? 'text-emerald-500' : 'text-slate-300'}`}>
                +{p.earned}/{p.points} pts
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legal Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          This score reflects <strong>information completeness only</strong>. It is not a character certificate, background check, or any form of personal guarantee.{' '}
          <a href="/terms#section-9" className="underline hover:text-indigo-500 transition-colors">Learn more</a>.
        </p>
      </div>
    </div>
  );
}
