'use client'

import { useEffect, useState } from 'react'
import { db } from '../app/lib/firebase'
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore'
import { Profile } from '../types/profile'
import PublicProfileCard from './PublicProfileCard'
import { ChevronRight, Loader2, Sparkles } from 'lucide-react'
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
    <section id="featured" className="bg-background pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden text-left">

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header - Enhanced UI */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.25em] shadow-sm">
              <Sparkles size={12} className="animate-pulse" /> Newly Added
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] italic font-serif">
              Community <span className="text-primary not-italic">Screened</span> <br /> Members
            </h2>
            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-xl">
              Fresh profiles carefully verified by our trusted community trust-desk for a safer search.
            </p>
          </div>

          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 text-foreground font-black uppercase tracking-[0.2em] text-[11px] hover:text-accent hover:gap-4 transition-all duration-300 group border-b border-border/50 pb-2"
          >
            Explore all profiles <ChevronRight size={18} className="text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-accent" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Scanning Archive...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-[3rem] border border-dashed border-border shadow-inner">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs italic">No profiles available currently</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 md:gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {profiles.map((profile) => (
              <div key={profile.id} className="block transform hover:-translate-y-4 transition-all duration-500 group">
                <div className="relative group-hover:shadow-2xl group-hover:shadow-accent/5 rounded-[2.5rem] transition-all">
                  <PublicProfileCard profile={profile} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-16 text-center md:hidden">
          <Link href="/search" className="inline-flex items-center gap-3 px-8 py-5 bg-muted border border-border rounded-2xl text-foreground font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all">
            See All Members <ChevronRight size={18} className="text-accent" />
          </Link>
        </div>

      </div>
    </section>
  )
}