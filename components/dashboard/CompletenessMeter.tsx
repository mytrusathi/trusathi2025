"use client";
import React from 'react';
import { Profile } from '@/types/profile';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  profile: Profile;
}

export default function CompletenessMeter({ profile }: Props) {
  const fields: (keyof Profile)[] = [
    'name', 'gender', 'dob', 'city', 'religion', 'caste', 
    'education', 'profession', 'income', 'fatherName', 
    'imageUrl', 'about', 'contact'
  ];

  const filledFields = fields.filter(f => !!profile[f]);
  const percentage = Math.round((filledFields.length / fields.length) * 100);

  const getStatusColor = () => {
    if (percentage < 40) return 'bg-rose-500';
    if (percentage < 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusText = () => {
    if (percentage < 40) return 'Needs Improvement';
    if (percentage < 80) return 'Good Start';
    return 'Excellent Profile';
  };

  const missing = fields.find(f => !profile[f]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Profile Strength</h4>
         </div>
         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg text-white ${getStatusColor()}`}>
            {percentage}%
         </span>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
         <div 
           className={`h-full transition-all duration-1000 ${getStatusColor()}`} 
           style={{ width: `${percentage}%` }}
         ></div>
      </div>

      <div className="flex items-center justify-between">
         <p className="text-xs font-bold text-slate-500">{getStatusText()}</p>
         {percentage === 100 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
               <CheckCircle2 size={12} /> All Set
            </div>
         ) : (
            <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase italic">
               <AlertCircle size={12} /> Add {missing?.toString()}
            </div>
         )}
      </div>
    </div>
  );
}
