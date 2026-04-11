"use client";

import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, ArrowRight, UserCircle, 
  Phone, Mail, Camera, MessageSquare, ShieldCheck,
  AlertCircle, Loader2
} from 'lucide-react';
import { Profile } from '@/types/profile';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Step {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isOptional?: boolean;
  action?: () => void;
  href?: string;
  buttonText: string;
}

interface Props {
  profile: Profile | null;
}

export default function AuthenticityChecklist({ profile }: Props) {
  const { user } = useAuth();
  
  // Calculate profile completeness (simple check)
  const coreFields: (keyof Profile)[] = [
    'name', 'gender', 'dob', 'city', 'religion', 'caste',
    'education', 'profession', 'income', 'fatherName',
    'imageUrl', 'about', 'contact'
  ];
  const filledCount = profile ? coreFields.filter(f => !!profile[f]).length : 0;
  const isProfileComplete = filledCount >= coreFields.length;

  const steps: Step[] = [
    {
      id: 'profile',
      title: 'Complete Profile',
      desc: 'Fill in all details to help people find you.',
      icon: <UserCircle size={20} />,
      isCompleted: isProfileComplete,
      href: '/dashboard/member?view=my-profiles',
      buttonText: isProfileComplete ? 'View Details' : 'Edit Profile'
    },
    {
      id: 'phone',
      title: 'Confirm Phone Number',
      desc: 'Confirm your phone via OTP to prevent fraud.',
      icon: <Phone size={20} />,
      isCompleted: !!profile?.phoneVerified,
      buttonText: profile?.phoneVerified ? 'Confirmed' : 'Confirm Now'
    },
    {
      id: 'email',
      title: 'Authenticate Email',
      desc: 'Stay updated with important match alerts.',
      icon: <Mail size={20} />,
      isCompleted: !!user?.emailVerified,
      isOptional: true,
      buttonText: user?.emailVerified ? 'Authenticated' : 'Authenticate Email'
    },
    {
      id: 'selfie',
      title: 'Upload Live Selfie',
      desc: 'A live shot proves you are real.',
      icon: <Camera size={20} />,
      isCompleted: !!profile?.selfieUrl,
      href: '/dashboard/member?view=my-profiles', // For now, handle in edit profile
      buttonText: profile?.selfieUrl ? 'Change Selfie' : 'Take Shot'
    },
    {
      id: 'admin',
      title: 'Chat with Admin',
      desc: 'Final step for official community screening.',
      icon: <MessageSquare size={20} />,
      isCompleted: !!profile?.adminApproved,
      href: '/dashboard/member?view=chats',
      buttonText: profile?.adminApproved ? 'Approved' : 'Start Chat'
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
         <ShieldCheck className="absolute -top-4 -right-4 text-white/10" size={120} />
         <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight">Onboarding Checklist</h3>
            <p className="text-indigo-100 text-sm font-medium">Follow these steps to reach 100% Authenticity Score.</p>
            
            <div className="pt-4 space-y-2">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
                  <span>Progress</span>
                  <span>{progressPercent}% Complete</span>
               </div>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 space-y-3">
         {steps.map((step, idx) => (
            <div 
              key={step.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                step.isCompleted 
                ? 'bg-emerald-50/50 border-emerald-100' 
                : 'bg-slate-50 border-slate-50 hover:border-indigo-100'
              }`}
            >
               <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
               }`}>
                  {step.isCompleted ? <CheckCircle2 size={20} /> : step.icon}
               </div>
               
               <div className="grow min-w-0">
                  <div className="flex items-center gap-2">
                     <h4 className={`text-sm font-bold truncate ${step.isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {step.title}
                     </h4>
                     {step.isOptional && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Optional</span>
                     )}
                  </div>
                  <p className={`text-xs truncate ${step.isCompleted ? 'text-emerald-700/60' : 'text-slate-500'}`}>
                     {step.desc}
                  </p>
               </div>

               {step.href ? (
                 <Link 
                   href={step.href} 
                   className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     step.isCompleted 
                     ? 'bg-emerald-100 text-emerald-700' 
                     : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white shadow-sm'
                   }`}
                 >
                    {step.buttonText} <ArrowRight size={12} />
                 </Link>
               ) : (
                 <button 
                   onClick={() => alert("Authenticity logic coming soon. Ensure all profile fields are filled!")}
                   className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     step.isCompleted 
                     ? 'bg-emerald-100 text-emerald-700' 
                     : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600'
                   }`}
                 >
                    {step.buttonText}
                 </button>
               )}
            </div>
         ))}
      </div>

      <div className="p-6 pt-0">
         <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
               <strong>Note:</strong> Admin approval may take 24-48 hours after you complete all steps. High Authenticity profiles get 10x more responses.
            </p>
         </div>
      </div>
    </div>
  );
}
