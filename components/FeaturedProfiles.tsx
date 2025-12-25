'use client'

import { useEffect, useState } from 'react'
import { db } from '../app/lib/firebase'
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore'
import { Profile } from '../types/profile'
import PublicProfileCard from './PublicProfileCard' // Import the new card
import { ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        // Fetch last 3 created profiles
        // Note: You need an index for 'createdAt' descending in Firestore if this warns you
        const q = query(collection(db, 'profiles'), limit(3)) 
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
    <section id="featured"
    className="bg-indigo-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Verified Members
            </h2>
            <p className="text-gray-500">
              Profiles recently added by our trusted Group Admins
            </p>
          </div>
        <div className="flex justify-between items-end mb-10">
          <Link
            href="/search"
            className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
          >
            View all <ChevronRight size={20} />
          </Link>
          </div>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-indigo-200">
            <p className="text-gray-500">No profiles available yet. Be the first to join!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Link key={profile.id} href="/login">
                 <PublicProfileCard profile={profile} />
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/login" className="inline-flex items-center text-indigo-600 font-bold">
            View all profiles <ChevronRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  )
}