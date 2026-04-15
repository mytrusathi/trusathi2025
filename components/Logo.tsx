"use client";

import React from 'react';
import Link from 'next/link';
import { Handshake } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-sm', iconSize: 14 },
    md: { box: 'w-8 h-8', text: 'text-lg', iconSize: 18 },
    lg: { box: 'w-10 h-10', text: 'text-xl', iconSize: 24 },
    xl: { box: 'w-14 h-14', text: 'text-3xl', iconSize: 32 }
  };

  const currentSize = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 group active:scale-95 transition-all ${className}`}>
      <div className={`${currentSize.box} bg-rose-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-rose-200 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
        <Handshake size={currentSize.iconSize} strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={`${currentSize.text} font-black text-slate-800 tracking-tighter transition-colors group-hover:text-rose-600`}>
          tru<span className="text-rose-600">Sathi</span>
        </span>
      )}
    </Link>
  );
}
