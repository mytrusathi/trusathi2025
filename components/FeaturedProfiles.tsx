'use client'

import { useEffect, useState } from 'react'
import { db } from '../app/lib/firebase'
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore'
import { Profile } from '../types/profile'
import PublicProfileCard from './PublicProfileCard'
import { ChevronRight, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        const q = query(
          collection(db, 'profiles'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(3)
        )
        const snap = await getDocs(q)

        const fetched = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Profile))

        setProfiles(fetched)
      } catch (error) {
        console.error("Failed to load featured profiles", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicProfiles()
  }, [])

  return (
    <section id="stories" className="bg-background py-20 md:py-10 relative overflow-hidden scroll-mt-0">

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[140px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header - Enhanced UI */}
        {/* Header: Sizes reduced and wording simplified */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="text-center md:text-left space-y-4 max-w-3xl animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-secondary border border-border/40 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={12} className="text-primary" /> Newly Joined
            </div>

            {/* Reduced from 6.5rem to 4xl/6xl */}
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Community <span className="text-primary">Verified</span> <br />
              <span className="text-foreground/80">Recent Profiles</span>
            </h2>

            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed opacity-90">
              Genuine profiles recently reviewed by our community desks to ensure a respectful search experience.
            </p>
          </div>

          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 text-foreground font-bold uppercase tracking-widest text-[11px] hover:text-primary transition-all group border-b-2 border-primary/10 pb-2"
          >
            Explore All Profiles <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State: Simplified wording */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Loading Profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-secondary/50 rounded-[2.5rem] border-2 border-dashed border-border/40">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No profiles found at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-10">
            {profiles.map((profile) => (
              <div key={profile.id} className="block group">
                <PublicProfileCard profile={profile} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/search" className="inline-flex items-center gap-3 px-8 py-4 bg-secondary border border-border/40 rounded-xl text-foreground font-bold uppercase tracking-wider text-[11px]">
            View All Profiles <ChevronRight size={18} className="text-primary" />
          </Link>
        </div>

      </div>
    </section>
  )
}