"use client";

import { ShieldCheck, Sparkles, Handshake, ChevronRight, Play } from 'lucide-react'
import SearchBar from './SearchBar'
import { db } from '@/app/lib/firebase'
import { collection, query, where, getCountFromServer } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <section className="relative bg-background pt-40 pb-24 md:pt-[7rem] md:pb-32 overflow-hidden text-left transition-colors">

      {/* Premium Animated Background Layers */}
      <div className="absolute inset-0 animate-mesh opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[radial-gradient(circle_at_top,var(--primary)/0.05,transparent_70%)] pointer-events-none animate-pulse duration-[8000ms]"></div>

      {/* Abstract Luxury Shapes */}
      <div className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[160px] pointer-events-none animate-in fade-in slide-in-from-right duration-[4000ms]"></div>
      <div className="absolute bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-primary/3 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Premium Trust Badge - Reimagined */}
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full glass-effect shadow-premium hover:shadow-lift transition-all duration-500 mb-8 animate-in fade-in slide-in-from-top-8 duration-1000 group cursor-default">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Handshake size={14} />
                </div>
              ))}
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-r border-border/50 pr-4">Open Community Portal</span>
            <span className="text-primary flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-accent animate-pulse" /> Always 100% Free
            </span>
          </div>

          {/* Master Heading - Elegant & Impactful */}
          <div className="relative space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-1200 delay-100">
            <h1 className="text-5xl md:text-[6.5rem] font-black text-foreground leading-[0.85] tracking-tighter">
              Find Your <br />
              <span className="relative font-serif text-luxury drop-shadow-sm tracking-tight inline-block py-2">
                True Sathi
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full opacity-40 text-accent" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17C118.333 5.66667 241.667 1.33333 355 17" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 not-italic font-medium tracking-normal mb-4 uppercase tracking-[0.2em]">
              Bringing every community together on one platform
            </p>
          </div>

          {/* Redefined Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-8 duration-1200 delay-300 px-4 mt-4">
            A unified matchmaking portal supported by community trust. <br className="hidden md:block" />
            <span className="text-foreground decoration-accent/30 decoration-wavy underline font-black">Manual Profile Review</span> for authentic and reliable connections
          </p>

          <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-16 duration-1200 delay-400 group/search relative mb-12">
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-[4rem] group-hover/search:bg-primary/10 transition-all duration-700 pointer-events-none"></div>
            <SearchBar variant="floating" />
          </div>

          <div className="flex flex-wrap justify-center gap-10 animate-in fade-in duration-1000 delay-500">
            <Link href="/register" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-all">
              <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-premium">
                <ChevronRight size={18} />
              </span>
              Start Your Journey
            </Link>
            <Link href="/about" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-all">
              <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-gold transition-all shadow-premium">
                <Play size={14} className="fill-current" />
              </span>
              Our Mission
            </Link>
          </div>
        </div>

        {/* Dynamic Stats - Luxury Horizontal Layout */}
        <div className="mt-10 pt-10 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 animate-in fade-in slide-in-from-bottom-12 duration-[2500ms] delay-700">
          <StatItem value={stats.profiles} label="Active Bio-Data" />
          <StatItem value={stats.communities} label="Trusted Groups" />
          <StatItem value="100%" label="Manual Verification" highlight />
          <StatItem value="FREE" label="Zero Joining Fees" noBorder />
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, highlight = false, noBorder = false }: { value: string, label: string, highlight?: boolean, noBorder?: boolean }) {
  return (
    <div className={`flex flex-col items-center group ${noBorder ? '' : 'md:border-r border-border/40'}`}>
      <span className={`text-5xl md:text-6xl font-black mb-3 tracking-tighter group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 font-serif ${highlight ? 'text-luxury' : 'text-foreground'}`}>
        {value}
      </span>
      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center px-4 leading-relaxed group-hover:text-accent transition-colors">
        {label}
      </span>
    </div>
  )
}