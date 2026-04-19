"use client";
import React from 'react';
import { Profile } from '@/types/profile';
import { CheckCircle2, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthenticity } from '@/hooks/useAuthenticity';
import { useAuth } from '@/context/AuthContext';

interface Props {
  profile: Profile;
}

export default function CompletenessMeter({ profile }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { pillars, totalScore } = useAuthenticity(profile, user);

  const getScoreColor = () => {
    if (totalScore < 40) return { bar: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Initial Setup' };
    if (totalScore < 70) return { bar: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Building Trust' };
    if (totalScore < 100) return { bar: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Validation Required' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Highly Authentic' };
  };

  const colors = getScoreColor();

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] space-y-5 animate-in fade-in slide-in-from-right-2 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-rose-600" />
          <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Trust Index</h4>
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${colors.badge}`}>
          {totalScore}/100
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${colors.bar}`}
            style={{ width: `${totalScore}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-1">
          <p className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>{colors.label}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{totalScore}%</p>
        </div>
      </div>

      {/* 5 Pillars */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 gap-2">
          {pillars.map((p) => (
            <div
              key={p.label}
              title={p.hint}
              onClick={() => p.view && router.push(`/dashboard/member?view=${p.view}`)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer group/pill ${
                p.isMet
                  ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-rose-200 hover:text-rose-600 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 ${p.isMet ? 'text-emerald-500' : 'text-slate-300 group-hover/pill:text-rose-500 transition-colors'}`}>
                  {p.isMet ? <CheckCircle2 size={14} /> : React.cloneElement(p.id === 'phone' ? <ShieldCheck size={14}/> : <Info size={14}/>)}
                </div>
                <div className="space-y-0.5">
                  <p className="truncate leading-none">{p.label}</p>
                  <p className={`text-[8px] font-black opacity-60`}>
                    +{p.earned}/{p.points} Pts
                  </p>
                </div>
              </div>
              {!p.isMet && <ArrowRight size={12} className="opacity-0 group-hover/pill:opacity-100 transition-all translate-x-1 group-hover/pill:translate-x-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="flex items-start gap-2.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
          This score reflects <strong>onboarding completeness only</strong>. It is not an identity guarantee or background check.{' '}
          <a href="/terms" className="underline hover:text-rose-500 transition-colors font-bold">Disclaimer</a>.
        </p>
      </div>
    </div>
  );
}
