import { UserPlus, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function GroupAdminCTA() {
  return (
    <section className="py-20 md:py-10 max-w-7xl mx-auto px-6 lg:px-8 group">
      {/* Container - Balanced Padding & Rounded Corners */}
      <div className="bg-primary rounded-[3rem] p-10 md:p-20 text-center md:text-left relative overflow-hidden shadow-xl border border-white/5 transition-all duration-700 hover:shadow-2xl">

        {/* Cinematic Ambient Effects - Subtle Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 lg:flex items-center justify-between gap-16">

          <div className="space-y-8 max-w-2xl">
            {/* Badge: Simple & Trustworthy */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <Zap size={14} className="text-accent" /> Community Partner Network
            </div>

            {/* Reduced Headline Size for better fit */}
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Manage Your <br className="hidden md:block" />
              <span className="text-accent border-b-4 border-accent/20">Community Group?</span>
            </h2>

            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed border-l-4 border-accent/30 pl-6">
              Bring your offline or WhatsApp circles to a verified platform. Become a
              <strong className="text-white font-bold"> Community Partner</strong> to manage
              members and help families connect safely with our easy-to-use toolkit.
            </p>

            <div className="flex flex-wrap items-center gap-8 pt-4 justify-center md:justify-start opacity-80">
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck size={18} className="text-accent" /> Verified Trust
              </div>
              <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest">
                <Star size={18} className="text-accent" /> Easy Management
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 flex flex-col gap-4 w-full md:w-auto shrink-0">
            {/* Primary Button: Clear Action */}
            <Link href="/register"
              className="group/btn relative px-10 py-5 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 overflow-hidden"
            >
              <UserPlus size={20} className="relative z-10" />
              <span className="relative z-10 uppercase tracking-widest text-[11px]">Become a Partner</span>
            </Link>

            {/* Secondary Button: Simple Info */}
            <Link href="/about"
              className="px-10 py-5 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/20 active:scale-95 backdrop-blur-sm"
            >
              <span className="uppercase tracking-widest text-[11px]">How it Works</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}