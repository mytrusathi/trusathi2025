'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Heart, Mail, Lock, Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] gap-6 text-white">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-white/10 border-t-rose-500 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center text-rose-500">
              <Heart size={20} fill="currentColor" className="animate-pulse" />
           </div>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-xs opacity-50">Authenticating...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="absolute top-8 left-8 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-3 text-slate-400 hover:text-white font-bold transition-all px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={18} /> <span className="text-sm uppercase tracking-widest">Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">
        
        <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl shadow-black/40">
           
           <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-3xl shadow-xl transform -rotate-6">
                 <Heart fill="white" className="text-white" size={32} />
              </div>
              <div className="space-y-1">
                 <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
                 <p className="text-slate-400 font-medium text-sm">Continue your journey with TruSathi</p>
              </div>
           </div>

           {error && (
             <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 border border-rose-500/20">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-4">
               <div className="relative group">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Mail size={20} />
                 </div>
                 <input
                   type="email"
                   className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                   placeholder="Email Address"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
               </div>

               <div className="relative group">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Lock size={20} />
                 </div>
                 <input
                   type="password"
                   className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
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
                  className="text-xs font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest"
                >
                  Forgot Password?
                </button>
             </div>

             <button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-rose-900/40 active:scale-[0.98]"
             >
               {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
             </button>
           </form>

           <div className="mt-12 text-center text-sm font-bold">
              <span className="text-slate-500">Need an account?</span>{' '}
              <Link href="/register" className="text-rose-500 hover:text-rose-400 transition-colors">
                Create Account
              </Link>
           </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 text-slate-500 text-xs font-black uppercase tracking-[0.2em] opacity-40">
           <div className="flex items-center gap-2 pr-6 border-r border-white/10"><ShieldCheck size={14} /> Encrypted</div>
           <div className="flex items-center gap-2"><Sparkles size={14} /> Service Mission</div>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
      />
    </div>
  )
}