'use client'

import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from 'app/lib/firebase'
import parseBiodata from 'app/utils/parseBiodata'
import { Profile } from '@/types/profile'
import { useAuth } from '@/context/AuthContext'

interface Props {
  initialData?: Profile | null
  onCancel: () => void
  onSaved: () => void
}

export default function ProfileForm({
  initialData,
  onCancel,
  onSaved,
}: Props) {
  const { user } = useAuth()

  const [rawText, setRawText] = useState('')
  const [formData, setFormData] = useState<Partial<Profile>>({})
  const [saving, setSaving] = useState(false)

  /* -----------------------------
     Prefill on Edit
  ------------------------------*/
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  /* -----------------------------
     Handlers
  ------------------------------*/
  const handleChange = (field: keyof Profile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleParse = () => {
    if (!rawText.trim()) return
    const parsed = parseBiodata(rawText)
    setFormData((prev) => ({ ...prev, ...parsed }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.uid) return

    try {
      setSaving(true)

      const payload = {
        ...(formData as Profile),
        groupAdminUid: user.uid,
        groupName: user.groupName || '',
        addedBy: user.email || '',
        updatedAt: serverTimestamp(),
      }

      if (initialData?.id) {
        // UPDATE
        await updateDoc(doc(db, 'profiles', initialData.id), payload)
      } else {
        // CREATE
        await addDoc(collection(db, 'profiles'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }

      onSaved()
    } catch (err) {
      console.error('Save profile failed:', err)
      alert('Failed to save profile. Check console.')
    } finally {
      setSaving(false)
    }
  }

  /* -----------------------------
     Render
  ------------------------------*/
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-950/70 border border-slate-800 rounded-2xl
                 p-4 shadow-2xl shadow-black/50 space-y-4"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
            {initialData ? 'Edit Profile' : 'Add New Profile'}
          </p>
          <p className="text-xs text-slate-400">
            Paste WhatsApp biodata or fill manually
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] px-3 py-1.5 rounded-lg
                     border border-slate-700 hover:border-slate-500 transition"
        >
          ← Back
        </button>
      </div>

      {/* BIODATA PARSER */}
      <div>
        <textarea
          placeholder="Paste WhatsApp biodata text here…"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full min-h-22.5 bg-slate-900 border border-slate-700
                     rounded-xl px-3 py-2 text-xs text-slate-100
                     placeholder:text-slate-500 outline-none"
        />

        <div className="flex justify-between mt-1">
          <button
            type="button"
            onClick={handleParse}
            className="text-[11px] px-2 py-1 rounded-lg
                       border border-slate-700
                       hover:border-indigo-500 hover:text-indigo-300 transition"
          >
            Parse & Fill
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({})
              setRawText('')
            }}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Input label="Name" value={formData.name || ''} onChange={(v) => handleChange('name', v)} />
        <Input label="Gender" value={formData.gender || ''} onChange={(v) => handleChange('gender', v)} />
        <Input label="Age" value={formData.age || ''} onChange={(v) => handleChange('age', v)} />
        <Input label="City" value={formData.city || ''} onChange={(v) => handleChange('city', v)} />
        <Input label="Profession" value={formData.profession || ''} onChange={(v) => handleChange('profession', v)} />
        <Input label="Education" value={formData.education || ''} onChange={(v) => handleChange('education', v)} />
      </div>

      {/* ACTION */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg text-xs font-semibold
                     bg-linear-to-r from-emerald-500 to-lime-500
                     text-slate-900 shadow hover:shadow-lg transition"
        >
          {saving
            ? 'Saving…'
            : initialData
            ? 'Update Profile'
            : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}

/* -----------------------------
   Small Input Component
------------------------------*/

function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wide">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700
                   rounded-lg px-2 py-1.5 text-xs text-slate-100
                   outline-none"
      />
    </div>
  )
}
