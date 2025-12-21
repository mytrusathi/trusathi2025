'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore'
import { db } from 'app/lib/firebase'
import { Profile } from '@/types/profile'

interface Props {
  user: any
  onAdd: () => void
  onView: (profile: Profile) => void
  onEdit: (profile: Profile) => void
}

function renderInitial(name?: string) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export default function ProfileList({
  user,
  onAdd,
  onView,
  onEdit,
}: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // ================= FETCH PROFILES =================
  useEffect(() => {
    if (!user?.uid) return

    const q = query(
      collection(db, 'profiles'),
      where('groupAdminUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Profile[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Profile),
          id: doc.id, // ensure Firestore ID wins
        }))
        setProfiles(list)
        setLoading(false)
      },
      (error) => {
        console.error('Error loading profiles:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  // ================= FILTER =================
  const filtered = profiles.filter((p: Profile) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      p.name?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.profession?.toLowerCase().includes(term)
    )
  })

  // ================= RENDER =================
  return (
    <div className="space-y-4">

      {/* SUMMARY CARD */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shadow-2xl shadow-black/50 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
            Group Profiles
          </p>
          <p className="text-xs text-slate-400 mt-1">
            You have{' '}
            <span className="font-semibold text-slate-50">
              {profiles.length}
            </span>{' '}
            profiles
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg
                     bg-linear-to-r from-rose-500 to-purple-500
                     text-white font-semibold shadow-md
                     hover:shadow-lg hover:scale-[1.01] transition"
        >
          + Add New Profile
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-2xl shadow-black/50">
        <input
          type="text"
          placeholder="Search by name, city, profession..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 px-3 py-2
                     rounded-xl text-sm text-slate-100
                     placeholder:text-slate-500 outline-none"
        />
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center text-slate-500 py-10 text-sm">
          Loading profiles…
        </div>
      )}

      {!loading && profiles.length === 0 && (
        <div className="text-center text-slate-500 py-12 text-sm">
          No profiles added yet. Click <b>Add New Profile</b> to publish your first biodata.
        </div>
      )}

      {!loading && filtered.length === 0 && profiles.length > 0 && (
        <div className="text-center text-slate-500 py-10 text-sm">
          No profiles match the current search.
        </div>
      )}

      {/* LIST */}
      {!loading && filtered.length > 0 && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl
                        shadow-2xl shadow-black/50 divide-y divide-slate-800">
          {filtered.map((p: Profile) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 py-3 px-3
                         hover:bg-slate-900 rounded-xl cursor-pointer transition"
            >
              {/* LEFT: Avatar + Info */}
              <div
                className="flex items-center gap-3"
                onClick={() => onView(p)}
              >
                <div className="w-9 h-9 rounded-full
                                bg-linear-to-br from-rose-400 via-purple-500 to-indigo-500
                                flex items-center justify-center
                                text-white text-sm font-semibold">
                  {renderInitial(p.name)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {p.name || '—'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {p.age && `${p.age} yrs`}
                    {p.gender && ` • ${p.gender}`}
                    {(p.city || p.pob) && ` • ${p.city || p.pob}`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {p.profession || 'Profession not specified'}
                  </p>
                </div>
              </div>

              {/* RIGHT: ACTION */}
              <button
                onClick={() => onEdit(p)}
                className="text-[11px] px-2 py-1 rounded-lg
                           border border-slate-700 text-slate-300
                           hover:border-indigo-500 hover:text-indigo-300 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
