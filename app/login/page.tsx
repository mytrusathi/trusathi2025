'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Handshake, Mail, Lock, Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import ForgotPasswordModal from '@/components/ForgotPasswordModal'

export default function LoginPage() {
  const { loginWithEmail, user, role, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    if (user && role) {
      if (role === 'super-admin') {
        router.replace('/dashboard/super-admin')
      } else if (role === 'group-admin') {
        if (user.isApproved === false) {
          router.replace('/pending-approval')
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
    } catch {
      setError('Invalid email or password. Please try again.')
      setIsSubmitting(false)
    }
  }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-navy-900 gap-6 text-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 border-t-brand-gold-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-brand-gold-500">
            <Handshake size={24} className="animate-pulse" />
          </div>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-brand-gold-500/50">Securing Connection...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy-900 p-4 relative overflow-hidden font-sans">

      {/* Premium Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-navy-700/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-400 hover:text-brand-gold-500 font-bold transition-all px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={18} /> <span className="text-[10px] uppercase tracking-widest">Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">

        {/* Glassmorphism Card */}
        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl shadow-black/60 relative overflow-hidden">

          {/* Decorative Inner Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold-500/10 blur-3xl rounded-full"></div>

          <div className="text-center mb-10 space-y-6">
            {/* Handshake Logo Box - Navy/Gold Theme */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[linear-gradient(135deg,var(--brand-navy-800)_0%,var(--brand-navy-700)_100%)] border border-brand-gold-500/30 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <Handshake className="text-brand-gold-500" size={38} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Continue your journey with a <span className="text-brand-gold-500 font-bold">Sathi</span> you can Trust
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-8 text-xs font-bold flex items-center gap-3 border border-rose-500/20">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-gold-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-brand-gold-500/20 focus:border-brand-gold-500/40 outline-none transition-all text-white placeholder:text-slate-700 font-medium"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-gold-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-brand-gold-500/20 focus:border-brand-gold-500/40 outline-none transition-all text-white placeholder:text-slate-700 font-medium"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[10px] font-black text-slate-500 hover:text-brand-gold-500 uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button - Amber/Gold */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-brand-gold-500/10 active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-12 text-center text-xs font-bold">
            <span className="text-slate-600 font-medium">Don't have an account?</span>{' '}
            <Link href="/register" className="text-brand-gold-500 hover:text-brand-gold-400 transition-colors uppercase tracking-widest underline decoration-brand-gold-500/20 underline-offset-4">
              Create Account
            </Link>
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <div className="flex items-center gap-2 pr-6 border-r border-white/10 text-brand-gold-500/50"><ShieldCheck size={14} /> Secured by TruSathi</div>
          <div className="flex items-center gap-2"><Sparkles size={14} /> Integrity First</div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  )
}