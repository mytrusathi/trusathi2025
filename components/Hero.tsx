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
          getCountFromServer(query(collection(db, 'profiles'), where('isPublic', '==', true))),
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
    <section className="relative bg-background pt-32 pb-32 md:pt-56 md:pb-40 overflow-hidden text-left transition-colors">

      {/* Classic Ambient Effects - Slow Elegant Subtlety */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(circle_at_top,var(--primary)/0.03,transparent_70%)] pointer-events-none animate-pulse duration-[5000ms]"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[180px] pointer-events-none animate-in fade-in slide-in-from-right-1/4 duration-[3000ms]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Premium Trust Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-card border border-border shadow-xl shadow-primary/10 text-foreground text-[10px] md:text-xs font-black backdrop-blur-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-white shadow-md">
                  <Handshake size={14} strokeWidth={2.5} />
                </div>
              ))}
            </div>
            <span className="tracking-[0.2em] uppercase text-muted-foreground">Premium Verification</span>
            <div className="h-4 w-px bg-border/50"></div>
            <span className="text-primary flex items-center gap-2 font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" /> Free Platform
            </span>
          </div>

          {/* Noble Heading - Elegant Minimalist Text */}
          <h1 className="text-6xl md:text-[9.5rem] font-black text-foreground leading-[0.85] mb-12 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 italic">
            Your <span className="relative inline-block not-italic text-primary drop-shadow-sm font-serif tracking-tight">
              True Sathi
              <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full opacity-30" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17C118.333 5.66667 241.667 1.33333 355 17" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
              </svg>
            </span> <br />
            <span className="text-2xl md:text-3xl text-muted-foreground not-italic font-medium block mt-6 tracking-normal">Honesty in every Bond.</span>
          </h1>

          {/* Elegant Subheading */}
          <p className="text-xl md:text-3xl text-muted-foreground mb-16 leading-tight max-w-4xl font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-200 px-4">
            A premium matchmaking sanctuary where <span className="text-primary font-black underline decoration-primary/20 decoration-8 underline-offset-8">Trust is the Foundation</span>. <br className="hidden md:block" />
            Transparent profiles, verified users, and a 100% free experience.
          </p>

          <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <SearchBar variant="floating" />
          </div>

          <div className="relative w-full">
            {/* Dynamic Key Benefits */}
            <div className="hidden sm:flex absolute -bottom-10 left-1/2 -translate-x-1/2 items-center gap-10 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
              <span className="flex items-center gap-2 group/tip hover:text-foreground transition-colors cursor-default">
                <ShieldCheck size={14} className="text-primary/70" /> Privacy First
              </span>
              <span className="flex items-center gap-2 group/tip hover:text-foreground transition-colors cursor-default">
                <Handshake size={14} className="text-primary/70" /> Trust-Driven
              </span>
              <span className="flex items-center gap-2 group/tip hover:text-foreground transition-colors cursor-default">
                <Sparkles size={14} className="text-primary/70" /> Community Managed
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 items-center animate-in fade-in slide-in-from-bottom-12 duration-[2000ms] delay-500">
          <div className="flex flex-col items-center group">
            <span className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.profiles}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Active Bio-Data</span>
          </div>
          <div className="flex flex-col items-center md:border-l border-border/50 group">
            <span className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stats.communities}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Trusted Groups</span>
          </div>
          <div className="flex flex-col items-center md:border-l border-border/50 group">
            <span className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tighter hover:scale-110 transition-transform">100%</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Manual Screening</span>
          </div>
          <div className="flex flex-col items-center md:border-l border-border/50 group">
            <span className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tighter">FREE</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Zero Fees</span>
          </div>
        </div>
      </div>
    </section>
  )
}