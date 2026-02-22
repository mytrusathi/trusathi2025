'use client'

import { FormEvent, useState } from 'react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react'

export default function ChangePasswordCard() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    if (!user || !user.email) {
      setMessage({ type: 'error', text: 'No authenticated user email found. Please log in again.' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' })
      return
    }

    if (currentPassword === newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password.' })
      return
    }

    setSaving(true)

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      setMessage({ type: 'success', text: 'Password updated successfully.' })
      resetForm()
    } catch (error: unknown) {
      const firebaseError = error as { code?: string }

      if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        setMessage({ type: 'error', text: 'Current password is incorrect.' })
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setMessage({ type: 'error', text: 'Too many attempts. Please try again in a few minutes.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update password. Please try again.' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="text-rose-500" size={20} />
        <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
        </div>

        {message && (
          <div
            className={`rounded-lg p-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </section>
  )
}
