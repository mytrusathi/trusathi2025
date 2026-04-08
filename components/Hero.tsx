import { CheckCircle, Shield, Users, Sparkles, Heart } from 'lucide-react'
import SearchBar from './SearchBar'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-[#0F172A] pt-12 pb-24 md:pt-24 md:pb-36 overflow-hidden">
      
      {/* Premium Gradient Overlays */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-600/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-xs md:text-sm font-bold backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="p-1 bg-indigo-500 rounded-full">
              <Shield size={12} className="text-white" />
            </div>
            Verified by Community Leaders
            <div className="h-4 w-px bg-white/20 mx-1"></div>
            <span className="text-rose-400 flex items-center gap-1"><Sparkles size={12} fill="currentColor" /> Premium Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-8 max-w-5xl tracking-tight animate-in fade-in slide-in-from-bottom duration-1000 delay-100">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">Soulmate</span> Within a<br className="hidden md:block" /> 
            Trusted Community.
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            TruSathi connects you with profiles personally verified by <span className="text-white font-bold underline decoration-indigo-500/50 decoration-4">Community Group Admins</span>. 
            Safe, authentic, and culturally matched through your own trusted network.
          </p>

          {/* Search Container with Glassmorphism */}
          <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/40 animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="bg-white rounded-[2rem] p-2 md:p-3">
                <SearchBar />
             </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards">
             <HeroStat icon={<Users className="text-indigo-400" />} label="Verified Communities" value="50+" />
             <HeroStat icon={<Sparkles className="text-rose-400" />} label="Total Profiles" value="5000+" />
             <HeroStat icon={<Heart className="text-amber-400" fill="currentColor" />} label="Successful Matches" value="100+" />
          </div>
        </div>
      </div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-10 md:left-20 animate-bounce delay-700 pointer-events-none opacity-20">
         <div className="w-12 h-12 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 rotate-12 flex items-center justify-center text-white">
            <Heart size={24} />
         </div>
      </div>
      <div className="absolute bottom-1/4 right-10 md:right-20 animate-pulse pointer-events-none opacity-20">
         <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 -rotate-12 flex items-center justify-center text-white">
            <Shield size={32} />
         </div>
      </div>
    </section>
  )
}

function HeroStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group">
       <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
          {icon}
       </div>
       <div className="text-left">
          <p className="text-2xl font-black text-white leading-none mb-1">{value}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</p>
       </div>
    </div>
  )
}
