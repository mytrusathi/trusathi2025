'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Globe, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/app/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

interface CommunityLinkModalProps {
  closeHref: string
}

export default function CommunityLinkModal({ closeHref }: CommunityLinkModalProps) {
  const { user } = useAuth()
  const [slug, setSlug] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user?.slug) setSlug(user.slug)
  }, [user?.slug])

  const handleUpdateSlug = async () => {
    if (!user?.uid || !slug) return
    setIsSaving(true)
    setMessage(null)
    try {
      const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      await updateDoc(doc(db, 'users', user.uid), { slug: cleanSlug })
      setSlug(cleanSlug)
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Community link updated successfully.' })
    } catch (error) {
      console.error('Failed to update URL', error)
      setMessage({ type: 'error', text: 'Failed to update community link.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
        <Link
          href={closeHref}
          className="absolute -top-2 -right-2 z-10 h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center"
          aria-label="Close community link window"
        >
          <X size={18} />
        </Link>

        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
          <Globe size={20} className="text-rose-500" /> Community Link
        </h2>

        {isEditing ? (
          <div className="flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Customize your handle</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
                <span className="text-slate-400 text-sm hidden sm:inline">trusathi.com/community/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent outline-none ml-1 flex-1 font-semibold text-slate-700"
                  placeholder="your-group-name"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setSlug(user?.slug || '')
                }}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSlug}
                disabled={isSaving || !slug}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 rounded-xl px-6 py-5 border border-slate-200 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Public Address</p>
              <p className="text-lg font-bold text-rose-600 break-all">trusathi.com/community/{user?.slug || 'loading...'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-200 bg-white rounded-lg transition-all shadow-sm"
            >
              <Settings size={16} /> Edit URL
            </button>
          </div>
        )}

        {message && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
