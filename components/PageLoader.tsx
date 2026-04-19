"use client";
import React from 'react';
import { Handshake } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoader = ({ message = "Connecting with Integrity", fullScreen = true }: PageLoaderProps) => {
  return (
    <div className={`z-[100] flex flex-col items-center justify-center bg-background overflow-hidden animate-mesh ${fullScreen ? 'fixed inset-0' : 'w-full h-full min-h-[400px]'}`}>
      
      {/* Sophisticated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Main Logo Container - Royal Reveal */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center group">
          {/* Outer Pulsing Aura */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Rotating Sophisticated Rings */}
          <div className="absolute inset-0 border-[1px] border-primary/20 rounded-[3rem] animate-[spin_8s_linear_infinite] scale-110"></div>
          <div className="absolute inset-0 border-t-2 border-primary/40 rounded-[3rem] animate-[spin_2s_cubic-bezier(0.76,0,0.24,1)_infinite]"></div>
          
          {/* Inner Logo Box */}
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-[0_20px_50px_rgba(164,22,26,0.15)] border border-primary/5 relative z-10">
            <Handshake size={40} strokeWidth={1} className="animate-pulse" />
          </div>

          {/* Floating Accents */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent/20 rounded-full blur-sm"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/20 rounded-full blur-sm"></div>
        </div>

        {/* Text Loader / Brand Identity */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <h2 className="text-primary text-2xl font-black uppercase tracking-[0.5em] animate-in fade-in slide-in-from-bottom-4 duration-1000">truSathi</h2>
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 animate-[shimmer_2s_infinite]"></div>
          </div>
          
          <div className="flex items-center gap-3">
             {[0, 150, 300].map((delay) => (
               <div 
                 key={delay}
                 className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                 style={{ animationDelay: `${delay}ms` }}
               ></div>
             ))}
          </div>
          
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60 px-6 text-center">
            {message}
          </p>
        </div>
      </div>

      {/* Modern Scanning Effect - Premium Detail */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Securing Authorization</span>
      </div>
    </div>
  );
};

export default PageLoader;
