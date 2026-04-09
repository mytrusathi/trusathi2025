"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegistrationSuccessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/member');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 shadow-3xl shadow-black/50 text-center space-y-8">
          
          <div className="relative inline-flex mb-4">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 size={48} className="text-emerald-400" />
             </div>
             <div className="absolute -top-2 -right-2 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-indigo-900/40">
                <Sparkles size={20} className="text-white" />
             </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight">Registration Successful!</h1>
            <p className="text-slate-400 font-medium text-lg">
               Welcome to <span className="text-rose-400">truSathi</span>, {user?.displayName || 'Partner'}. 
               Your profile is now active and ready to find its match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
                <Heart className="text-rose-500 mx-auto" size={24} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Finding Matches</h3>
                <p className="text-[11px] text-slate-500 font-medium">Browse verified profiles based on your community and preferences.</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
                <ShieldCheck className="text-emerald-400 mx-auto" size={24} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Safe & Secure</h3>
                <p className="text-[11px] text-slate-500 font-medium">Your data is encrypted and only shared with matches you approve.</p>
             </div>
          </div>

          <div className="pt-4 space-y-4">
            <Link 
              href="/dashboard/member" 
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-rose-900/40 transform active:scale-[0.98]"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
               Redirecting in {countdown} seconds...
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
