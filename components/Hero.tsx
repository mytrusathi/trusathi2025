"use client";

import { CheckCircle, Shield, Users, Sparkles, Heart, Search, Star, MousePointer2 } from 'lucide-react'
import { CheckCircle, Shield, Users, Sparkles, Heart, Search, Star, MousePointer2 } from 'lucide-react'
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
    <section className="relative bg-[#0F172A] pt-12 pb-24 md:pt-32 md:pb-48 overflow-hidden">
      
      {/* Dynamic Animated Background */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-indigo-600/20 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>
      
      {/* Animated Orb 1 */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      {/* Animated Orb 2 */}
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] animate-bounce duration-[10000ms] pointer-events-none"></div>
      {/* Animated Orb 3 */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Modern Floating Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs md:text-sm font-black backdrop-blur-xl mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-[0.2em] uppercase opacity-80">Verified Community Network</span>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-rose-400 flex items-center gap-1.5 font-black uppercase tracking-widest italic">
               <Sparkles size={14} fill="currentColor" /> Service to Mankind
            </span>
          </div>

          {/* Ultra-Modern Heading */}
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.95] mb-10 max-w-6xl tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             Your <span className="relative inline-block">
                True Sathi
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M3 17C118.333 5.66667 241.667 1.33333 355 17" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
                </svg>
             </span> <br/>
             In a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">Verified Way.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-slate-400 mb-14 leading-relaxed max-w-3xl font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            Connecting souls through <span className="text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">Community Trust</span>. 
            No platform charges, no fake profiles—just pure service to help you find your partner.
          </p>

          {/* Search Hub with Glassmorphism */}
          <div className="w-full max-w-5xl group relative animate-in fade-in zoom-in duration-1000 delay-300">
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
             
             <div className="relative bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[3rem] border border-white/20 shadow-2xl">
                <div className="bg-white rounded-[2.2rem] p-2 md:p-3 shadow-inner">
                   <SearchBar />
                </div>
             </div>
             
             {/* Floating Search Insight */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> 100% Free</span>
                <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Community Verified</span>
                <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> No Fake Stories</span>
             </div>
          </div>

          {/* Social Proof / Trust Indicators */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
             <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white mb-1">{stats.profiles}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Members</span>
             </div>
             <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl font-black text-white mb-1">{stats.communities}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Communities</span>
             </div>
             <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl font-black text-white mb-1">100%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified</span>
             </div>
             <div className="flex flex-col items-center border-l border-white/10">
                <span className="text-3xl font-black text-white mb-1">Free</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Always</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Floating Cards (Background Layer) */}
      <div className="absolute top-1/4 -left-20 animate-float pointer-events-none hidden lg:block">
         <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl rotate-12 shadow-2xl">
            <div className="w-40 h-2 bg-white/20 rounded-full mb-3"></div>
            <div className="w-24 h-2 bg-white/10 rounded-full"></div>
         </div>
      </div>
      <div className="absolute bottom-1/4 -right-20 animate-float-delayed pointer-events-none hidden lg:block">
         <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] -rotate-6 shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
               <Heart size={24} fill="currentColor" />
            </div>
            <div>
               <div className="w-20 h-2 bg-white/20 rounded-full mb-2"></div>
               <div className="w-12 h-2 bg-white/10 rounded-full"></div>
            </div>
         </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-30px) rotate(-6deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-draw {
           stroke-dasharray: 400;
           stroke-dashoffset: 400;
           animation: draw 2s ease-out forwards 1s;
        }
        @keyframes draw {
           to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  )
}
