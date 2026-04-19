'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Mail, Lock, Loader2, ArrowRight, Sparkles, ShieldCheck, Handshake } from 'lucide-react'
import PageLoader from '@/components/PageLoader'
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
        router.replace('/dashboard/group-admin')
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

  if (loading) {
    return <PageLoader message="Securing Connection..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans">

      {/* Premium Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-muted rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-muted-foreground hover:text-primary font-bold transition-all px-4 py-2 bg-card rounded-2xl border border-border shadow-sm"
        >
          <ArrowLeft size={18} /> <span className="text-[10px] uppercase tracking-widest">Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">

        {/* Sober Card */}
        <div className="bg-card p-8 md:p-12 rounded-[3.5rem] border border-border shadow-[0_30px_70px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">

          {/* Decorative Inner Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full"></div>

          <div className="text-center mb-10 space-y-6">
            {/* Handshake Logo Box */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 border border-primary/10 rounded-3xl transform hover:scale-105 transition-transform duration-500">
              <Handshake className="text-primary" size={38} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h1>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                Continue your journey with a <span className="text-primary font-bold">Sathi</span> you can Trust
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-600 p-4 rounded-2xl mb-8 text-xs font-bold flex items-center gap-3 border border-rose-500/20">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full pl-16 pr-6 py-5 bg-secondary border border-border rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all text-foreground placeholder:text-muted-foreground font-medium"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full pl-16 pr-6 py-5 bg-secondary border border-border rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all text-foreground placeholder:text-muted-foreground font-medium"
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
                className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20 active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-12 text-center text-xs font-bold">
            <span className="text-muted-foreground font-medium">Don't have an account?</span>{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors uppercase tracking-widest underline decoration-primary/20 underline-offset-4">
              Create Account
            </Link>
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="mt-10 flex items-center justify-center gap-6 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
          <div className="flex items-center gap-2 pr-6 border-r border-border text-primary/80"><ShieldCheck size={14} /> Secured by TruSathi</div>
          <div className="flex items-center gap-2 text-primary/80"><Sparkles size={14} /> Integrity First</div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  )
}