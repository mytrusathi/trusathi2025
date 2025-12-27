'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Heart, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { loginWithEmail, user, role, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🔁 AUTO REDIRECT AFTER LOGIN
  useEffect(() => {
    if (loading) return

    if (user && role) {
      if (role === 'super-admin') {
        router.replace('/dashboard/super-admin')
      } else if (role === 'group-admin') {
        if (user.isApproved === false) {
           router.replace('/register/pending')
        } else {
           router.replace('/dashboard/group-admin')
        }
      } else if (role === 'member') {
        router.replace('/dashboard/member')
      }
    }
  }, [user, role, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await loginWithEmail(email, password)
      // 🚫 DO NOT redirect here; AuthContext + useEffect handles it
    } catch (err) {
      setError('Invalid email or password. Please try again.')
      setIsSubmitting(false)
    }
  }

  // ⏳ While checking initial auth state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
        <p className="text-slate-500 font-medium">Connecting to secure server...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      
      {/* ✅ NEW: Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-medium transition-colors p-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md transition-all relative z-0">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 text-rose-600 rounded-xl mb-4">
            <Heart fill="currentColor" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to manage your profile and matches</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-red-100">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs text-rose-600 hover:text-rose-700 font-medium">Forgot Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-[0.98] duration-100"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-600 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-rose-600 font-semibold hover:underline hover:text-rose-700 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
      
      {/* Simple Footer/Copyright */}
      <div className="absolute bottom-4 text-center w-full text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} Trusathi. All rights reserved.
      </div>
    </div>
  )
}