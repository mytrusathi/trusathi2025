'use client'

import { useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from 'app/lib/firebase'
import parseBiodata from 'app/utils/parseBiodata'

export default function ProfileForm({ user, initialData, onCancel, onSaved }: any) {
  const [rawText, setRawText] = useState('')
  const [formData, setFormData] = useState(initialData || {})

  const handleParse = () => {
    if (!rawText.trim()) return
    const parsed = parseBiodata(rawText)
    setFormData((prev: any) => ({ ...prev, ...parsed }))
  }

  const handleChange = (k: string, v: string) => {
    setFormData((prev: any) => ({ ...prev, [k]: v }))
  }

  const handleSubmit = async () => {
    const base = {
      ...formData,
      groupAdminUid: user.uid,
      updatedAt: serverTimestamp(),
    }

    if (initialData?.id) {
      await updateDoc(doc(db, 'profiles', initialData.id), base)
    } else {
      await addDoc(collection(db, 'profiles'), {
        ...base,
        createdAt: serverTimestamp(),
      })
    }

    onSaved()
  }

  return (
    <div className="bg-slate-900 p-4 rounded space-y-3">
      <textarea
        placeholder="Paste biodata here"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full bg-slate-800 p-2 rounded text-xs"
      />

      <button onClick={handleParse} className="text-xs text-indigo-400">
        Parse & Fill
      </button>

      <input
        placeholder="Name"
        value={formData.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full bg-slate-800 p-2 rounded"
      />

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="bg-indigo-600 px-4 py-2 rounded text-sm">
          Save
        </button>
        <button onClick={onCancel} className="text-sm text-slate-400">
          Cancel
        </button>
      </div>
    </div>
  )
}
