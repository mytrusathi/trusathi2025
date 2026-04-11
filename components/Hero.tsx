"use client";

import { ShieldCheck, Sparkles, Handshake } from 'lucide-react' // Heart replace kiya Handshake se
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
          matches: '10+'
        });
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    }
    fetchActualStats();
  }, []);

  return (
    <section className="relative bg-[#01040f] pt-16 pb-32 md:pt-40 md:pb-56 overflow-hidden">

      {/* Premium Ambient Background - Using Navy/Gold tones */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.05),transparent_60%)] pointer-events-none"></div>

      {/* Sophisticated Animated Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[120px] animate-bounce duration-[15000ms] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Glassmorphic Badge - Handshake Icon Integration */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-black backdrop-blur-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-2xl">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#01040f] bg-slate-900 flex items-center justify-center text-amber-500 shadow-lg">
                  <Handshake size={10} strokeWidth={2.5} />
                </div>
              ))}
            </div>
            <span className="tracking-[0.3em] uppercase opacity-70">Your Search Companion</span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-amber-400 flex items-center gap-2 font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} className="animate-pulse" /> 100% Free Service
            </span>
          </div>

          {/* Cinematic Heading - Updated Gold Underline */}
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] mb-12 max-w-7xl tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 italic">
            Your <span className="relative inline-block not-italic">
              True Sathi
              <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17C118.333 5.66667 241.667 1.33333 355 17" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
              </svg>
            </span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-amber-200 to-slate-400 not-italic">Honesty in every Bond.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-slate-400 mb-16 leading-relaxed max-w-4xl font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-200 px-4">
            A dedicated platform for meaningful matches where <span className="text-white font-black underline decoration-amber-500/50 decoration-4 underline-offset-8">Integrity is Key</span>. <br className="hidden md:block" />
            Direct portal access, community-driven insights, and a 100% free experience.
          </p>

          {/* High-Contrast Search Hub - Updated Glow Colors */}
          <div className="w-full max-w-5xl group relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 to-slate-500/10 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative z-20">
              <SearchBar variant="embedded" />
            </div>

            {/* Dynamic Key Benefits */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-10 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
              <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                <ShieldCheck size={14} className="text-amber-500" /> Privacy First
              </span>
              <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                <Handshake size={14} className="text-amber-500" /> Trust-Driven
              </span>
              <span className="flex items-center gap-2 group/tip hover:text-white transition-colors cursor-default">
                <Sparkles size={14} className="text-amber-400" /> Community Managed
              </span>
            </div>
          </div>

          {/* Stats Section - Clean Navy/White Look */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 items-center animate-in fade-in slide-in-from-bottom-12 duration-[2000ms] delay-500">
            <div className="flex flex-col items-center group">
              <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.profiles}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Bio-Data</span>
            </div>
            <div className="flex flex-col items-center md:border-l border-white/5 group">
              <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.communities}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Trusted Groups</span>
            </div>
            <div className="flex flex-col items-center md:border-l border-white/5 group">
              <span className="text-4xl md:text-5xl font-black text-amber-500 mb-2 tracking-tighter">100%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Manual Screening</span>
            </div>
            <div className="flex flex-col items-center md:border-l border-white/5 group">
              <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter text-amber-500/80">FREE</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Zero Fees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Underline Animation */}
      <style jsx global>{`
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