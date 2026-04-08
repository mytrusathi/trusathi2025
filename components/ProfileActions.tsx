"use client";

import React from 'react';
import { Printer, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileActions() {
  const { user } = useAuth();
  const router = useRouter();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleConnect = () => {
    if (!user) {
      router.push('/login');
    } else {
      // In a real app, this would trigger a contact reveal or request
      alert('Interest sent! We will notify the group admin or member.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Button Wrapper */}
      <div className="flex justify-end no-print">
         <button 
           onClick={handlePrint}
           className="w-full md:w-auto px-6 py-3 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
         >
            <Printer size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> 
            <span>Print / Save PDF</span>
         </button>
      </div>

      {/* Main Connect Action Card */}
      <div className="bg-indigo-600 rounded-3xl p-8 no-print shadow-xl shadow-indigo-100 relative overflow-hidden group">
          {/* Decorative Background Icon */}
          <ShieldCheck size={120} className="absolute -bottom-6 -right-6 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h4 className="text-white font-black text-xl leading-tight">Interest in this Profile?</h4>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
                 {user 
                   ? "Sending an interest is the first step towards a meaningful connection." 
                   : "Log in to view contact details or express interest in this verified match."}
              </p>
            </div>

            <button 
              onClick={handleConnect}
              className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
                {user ? "Send Interest Now" : "Login to Connect"} 
                <ExternalLink size={18} />
            </button>
            
            <p className="text-center text-[10px] text-indigo-200 font-bold uppercase tracking-widest leading-none">
                {user ? "Verified Member" : "Auth Required"}
            </p>
          </div>
      </div>
    </div>
  );
}

export function FavoriteButton() {
    return (
        <button 
          onClick={() => alert('Saved to interests!')}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-rose-500 hover:scale-110 transition-all shadow-xl"
        >
            <Heart size={20} />
        </button>
    );
}
