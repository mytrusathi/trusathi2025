import { UserPlus, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function GroupAdminCTA() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Container - Luxury Vibrant Gradient */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-[4rem] p-12 md:p-28 text-center md:text-left relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(var(--primary-rgb),0.3)] group border border-white/10">

        {/* Cinematic Ambient Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/30 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 lg:flex items-center justify-between gap-20">

          <div className="space-y-10 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-accent text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Zap size={14} className="fill-accent text-accent animate-pulse" /> Empower Your Community
            </div>

            <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter font-serif">
              Are you a <br className="hidden md:block" />
              <span className="text-accent italic">Community Leader?</span>
            </h2>

            <p className="text-white/80 text-xl md:text-2xl font-medium leading-tight">
              Take your WhatsApp or Social media group to the next level. Become a
              <strong className="text-white"> Community Trustee</strong> on TruSathi to professionally manage,
              screen, and protect your members with luxury tools.
            </p>

            <div className="flex flex-wrap items-center gap-10 pt-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-white/70 font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck size={18} className="text-accent" /> Data Integrity
              </div>
              <div className="flex items-center gap-2 text-white/70 font-black text-[10px] uppercase tracking-widest">
                <Star size={18} className="text-accent" /> Trustee Portal
              </div>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-6 w-full md:w-auto shrink-0">
            {/* Primary Button */}
            <Link href="/register"
              className="group/btn relative px-12 py-6 bg-white text-primary font-black rounded-2xl shadow-2xl hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 overflow-hidden text-center"
            >
              <UserPlus size={22} className="group-hover/btn:rotate-12 transition-transform" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-xs">Register Trustee Account</span>
            </Link>

            {/* Secondary Button */}
            <Link href="/about"
              className="px-12 py-6 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20 active:scale-95"
            >
              <span className="uppercase tracking-[0.2em] text-xs">Explore Benefits</span> <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}