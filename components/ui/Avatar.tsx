"use client";

import React from 'react';
import Image from 'next/image';
import { User, Lock } from 'lucide-react';
import { getInitials } from '@/app/lib/privacy-utils';

interface AvatarProps {
  src?: string;
  name: string;
  isRevealed?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar = ({ src, name, isRevealed = true, size = 'md', className = '' }: AvatarProps) => {
  const initials = getInitials(name);
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-xl',
    lg: 'w-32 h-32 text-4xl',
    xl: 'w-48 h-48 text-6xl',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 48,
    xl: 64,
  };

  const containerBase = "relative rounded-[1.5rem] overflow-hidden flex items-center justify-center shrink-0 border border-border/50 bg-secondary shadow-inner";

  // Case 1: No Image -> Show Initials
  if (!src) {
    return (
      <div className={`${containerBase} ${sizeClasses[size]} ${className} bg-primary/5 text-primary/40 font-black tracking-tighter`}>
        {initials}
      </div>
    );
  }

  // Case 2: Image present but Hidden/Masked -> Blur and Add Lock
  if (!isRevealed) {
    return (
      <div className={`${containerBase} ${sizeClasses[size]} ${className}`}>
        <Image 
          src={src} 
          alt={name} 
          fill 
          className="object-cover blur-2xl grayscale opacity-50"
          unoptimized 
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
           <Lock size={iconSizes[size] / 1.5} className="text-white/50" />
        </div>
      </div>
    );
  }

  // Case 3: Image present and Revealed -> Clear Image
  return (
    <div className={`${containerBase} ${sizeClasses[size]} ${className}`}>
      <Image 
        src={src} 
        alt={name} 
        fill 
        className="object-cover transition-transform duration-700 hover:scale-110"
        unoptimized 
      />
    </div>
  );
};

export default Avatar;
