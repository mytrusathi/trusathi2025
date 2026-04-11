'use client'

import { useEffect, useState } from 'react'
import { db } from '../app/lib/firebase'
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore'
import { Profile } from '../types/profile'
import PublicProfileCard from './PublicProfileCard' // Import the new card
import { ChevronRight, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        // Fetch last 3 created profiles
        // Note: You need an index for 'createdAt' descending in Firestore if this warns you
        const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'), limit(3)) 
        const snap = await getDocs(q)
        
        const fetched = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Profile)).filter((profile) => profile.isPublic !== false)
        
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
    <section id="featured"
    className="bg-indigo-50/50 py-20 md:py-32 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
               <Sparkles size={12} /> Newly Added
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Community <span className="text-indigo-600">Screened</span> Members
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Fresh profiles carefully added by our trusted Community Leaders.
            </p>
          </div>
          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[11px] hover:gap-4 transition-all duration-300"
          >
            View all profiles <ChevronRight size={18} />
          </Link>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-indigo-200 shadow-inner">
            <p className="text-slate-500 font-bold">No profiles available yet. Be the first to join our mission!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {profiles.map((profile) => (
              <Link key={profile.id} href={`/profile/${profile.id}`} className="block transform hover:-translate-y-2 transition-transform duration-500">
                 <PublicProfileCard profile={profile} />
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/search" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
            View all profiles <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  )
}
