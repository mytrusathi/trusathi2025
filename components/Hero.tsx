"use client";

import { CheckCircle, Shield, ShieldCheck, Users, Sparkles, Heart, Search, Star, MousePointer2 } from 'lucide-react'
import SearchBar from './SearchBar'
import { db } from '@/app/lib/firebase'
import { collection, query, where, getCountFromServer } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [stats, setStats] = useState({
    profiles: '...',
    communities: '...',
    matches: '10+'
  });

  useEffect(() => {
    async function fetchActualStats() {
      try {
        const [profileCount, communityCount] = await Promise.all([
          getCountFromServer(collection(db, 'profiles')),
          getCountFromServer(query(collection(db, 'users'), where('role', '==', 'group-admin')))
        ]);
        
        setStats({
          profiles: profileCount.data().count.toString(),
          communities: communityCount.data().count.toString(),
          matches: '10+' // Keep as small realistic baseline for startup phase
        });
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    }
    fetchActualStats();
  }, []);

  return (
    <section className="relative bg-[#01040f] pt-16 pb-32 md:pt-40 md:pb-56 overflow-hidden">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none"></div>
      
      {/* Sophisticated Animated Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-bounce duration-[15000ms] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Glassmorphic Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-black backdrop-blur-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-2xl">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full border-2 border-[#01040f] bg-slate-800 flex items-center justify-center text-[8px]">
                    <Heart size={8} fill="currentColor" className="text-indigo-400/40" />
                 </div>
               ))}
            </div>
            <span className="tracking-[0.3em] uppercase opacity-70">Community Managed Protocol</span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-emerald-400 flex items-center gap-2 font-black uppercase tracking-[0.3em]">
               <Sparkles size={14} className="animate-pulse" /> 100% Free Service
            </span>
          </div>

          {/* Cinematic Heading */}
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] mb-12 max-w-7xl tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 italic">
             Your <span className="relative inline-block not-italic">
                True Sathi
                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M3 17C118.333 5.66667 241.667 1.33333 355 17" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
                </svg>
             </span> <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-400 not-italic">Authenticity by Trust.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-slate-400 mb-16 leading-relaxed max-w-4xl font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-200 px-4">
            A screened matchmaking ecosystem where <span className="text-white font-black underline decoration-indigo-500/50 decoration-4 underline-offset-8">Trust is the Currency</span>. 
            Direct portal access, community-vetted profiles, and zero platform fees.
          </p>

          {/* High-Contrast Search Hub */}
          <div className="w-full max-w-5xl group relative animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
             
             <div className="relative bg-white/5 backdrop-blur-2xl p-6 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <div className="bg-white rounded-[3rem] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                   <SearchBar />
                </div>
             </div>
             
             {/* Dynamic Key Benefits */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-10 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                  <ShieldCheck size={14} className="text-emerald-500" /> Secure Protocol
                </span>
                <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                  <Heart size={14} className="text-rose-500" /> Community Screened
                </span>
                <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                  <Sparkles size={14} className="text-indigo-400" /> Pure Service
                </span>
             </div>
          </div>

          {/* Quantifiable Trust */}
          <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 items-center animate-in fade-in slide-in-from-bottom-12 duration-[2000ms] delay-500">
             <div className="flex flex-col items-center group">
                <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.profiles}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Bio-Data</span>
             </div>
             <div className="flex flex-col items-center md:border-l border-white/5 group">
                <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.communities}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Trusted Groups</span>
             </div>
             <div className="flex flex-col items-center md:border-l border-white/5 group">
                <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter text-emerald-400">100%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Manual Screening</span>
             </div>
             <div className="flex flex-col items-center md:border-l border-white/5 group">
                <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter text-indigo-400">0.00</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Platform Fee</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Abstract Background Accents */}
      <div className="absolute top-1/3 -left-20 animate-float pointer-events-none opacity-20 hidden lg:block">
         <div className="w-64 h-64 bg-indigo-500/10 rounded-[4rem] border border-white/10 blur-xl"></div>
      </div>
      <div className="absolute bottom-1/4 -right-32 animate-float-delayed pointer-events-none opacity-20 hidden lg:block">
         <div className="w-96 h-96 bg-emerald-500/10 rounded-full border border-white/5 blur-2xl"></div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-30px) rotate(15deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-40px) rotate(-10deg); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
        .animate-draw {
           stroke-dasharray: 400;
           stroke-dashoffset: 400;
           animation: draw 2.5s cubic-bezier(0.65, 0, 0.35, 1) forwards 1.2s;
        }
        @keyframes draw {
           to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  )
}
