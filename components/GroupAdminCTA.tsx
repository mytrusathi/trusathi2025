import { UserPlus, ShieldCheck, Zap, ArrowRight, Star, Handshake } from 'lucide-react'
import Link from 'next/link'

export default function GroupAdminCTA() {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Container - Updated to Navy/Slate Gradient */}
      <div className="bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#1e293b_100%)] rounded-[3.5rem] p-10 md:p-24 text-center md:text-left relative overflow-hidden shadow-3xl shadow-slate-200/20 group border border-white/5">

        {/* Animated Background Orbs - Updated to Amber/Gold */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 lg:flex items-center justify-between gap-16">

          <div className="space-y-8 max-w-2xl">
            {/* Badge - Updated to Amber */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
              <Zap size={14} className="fill-amber-500 text-amber-500" /> Empower Your Community
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Are you a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Community Leader?</span>
            </h2>

            <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
              Take your WhatsApp or Social media group to the next level. Become a
              <strong className="text-white"> Group Admin</strong> on TruSathi to professionally manage,
              screen, and protect your members&apos; privacy with state-of-the-art tools.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={16} className="text-amber-500/60" /> Data Integrity
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <Star size={16} className="text-amber-500/60" /> Professional Dashboard
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-4 w-full md:w-auto shrink-0">
            {/* Primary Button - Amber/Gold Theme */}
            <Link href="/register"
              className="group/btn relative px-10 py-5 bg-amber-500 text-slate-950 font-black rounded-2xl shadow-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 active:scale-95 overflow-hidden"
            >
              <UserPlus size={20} className="group-hover/btn:rotate-12 transition-transform" />
              <span className="relative z-10 uppercase tracking-wider text-xs">Create Admin Account</span>
            </Link>

            {/* Secondary Button - Glass Effect */}
            <Link href="/about"
              className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95"
            >
              <span className="uppercase tracking-wider text-xs">Explore Benefits</span> <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}