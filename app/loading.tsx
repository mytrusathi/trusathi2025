import { Handshake } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-navy-950 overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold-500/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Main Logo Container */}
        <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
          {/* Animated Rings */}
          <div className="absolute inset-0 border-4 border-brand-gold-500/20 rounded-[2.5rem] animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 border-t-4 border-brand-gold-500 rounded-[2.5rem] animate-[spin_1.5s_cubic-bezier(0.76,0,0.24,1)_infinite]"></div>
          
          <div className="w-16 h-16 bg-brand-navy-900 rounded-3xl flex items-center justify-center text-brand-gold-500 shadow-2xl border border-brand-gold-500/20">
            <Handshake size={32} strokeWidth={1.5} className="animate-pulse" />
          </div>
        </div>

        {/* Text Loader */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-white text-lg font-black uppercase tracking-[0.4em] animate-pulse">truSathi</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-brand-gold-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-brand-gold-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-brand-gold-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Connecting with Integrity</p>
        </div>
      </div>

      {/* Modern Scanning Effect */}
      <div className="absolute bottom-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold-500/20 to-transparent animate-[shimmer_2s_infinite]"></div>
    </div>
  );
}
