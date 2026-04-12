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
    // Gap Fix: Changed pt-20 to pt-10 and added a subtle bg-white
    <section id="featured"
      className="bg-white pt-10 pb-20 md:pt-10  md:pb-0 relative overflow-hidden">

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header - Updated to Navy/Gold theme */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles size={12} /> Newly Added
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Community <span className="text-amber-500">Screened</span> Members
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Fresh profiles carefully added by our trusted Community Leaders.
            </p>
          </div>

          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[11px] hover:text-amber-600 hover:gap-4 transition-all duration-300 group"
          >
            View all profiles <ChevronRight size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
            <p className="text-slate-500 font-bold italic">No profiles available yet. Be the first to join our mission!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {profiles.map((profile) => (
              <div key={profile.id} className="block transform hover:-translate-y-3 transition-all duration-500 group">
                {/* Link component ko hata kar sirf div rakha hai taaki nesting error na aaye */}
                <div className="relative group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] transition-all">
                  <PublicProfileCard profile={profile} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/search" className="inline-flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-xs">
            View all profiles <ChevronRight size={18} className="text-amber-500" />
          </Link>
        </div>

      </div>
    </section>
  )
}