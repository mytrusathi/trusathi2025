import React from 'react';
import Image from 'next/image';
import { Profile } from '../types/profile';
import { MapPin, Briefcase, User, ShieldCheck, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FavoriteButton } from './ProfileActions';
import { useProfileReveal } from '@/hooks/useProfileReveal';
import { isFieldVisible, maskName } from '@/app/lib/privacy-utils';
import Avatar from './ui/Avatar';

interface Props {
  profile: Profile;
}

const PublicProfileCard = ({ profile }: Props) => {
  const { user } = useAuth();
  
  const { isRevealed, loading: revealLoading } = useProfileReveal(profile);

  // Helper: Calculate Age from DOB
  const getAge = (dob?: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(profile.dob);
  const displayName = isRevealed ? profile.name : maskName(profile.name);

  if (profile.privacyLevel === 'MembersOnly' && !user) {
    return (
      <div className="bg-card rounded-[2rem] border border-border p-10 flex flex-col items-center justify-center text-center space-y-8 shadow-premium min-h-[450px]">
         <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground border border-border shadow-inner">
            <Lock size={40} className="opacity-50" />
         </div>
         <div className="space-y-3">
            <h3 className="font-black text-foreground tracking-tight text-2xl font-serif italic">Sanctuary Access Only</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">This profile is protected within our private community. Sign in to view full details.</p>
         </div>
         <Link href="/login" className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-premium hover:shadow-lift transition-all active:scale-95">Enter Sanctuary</Link>
      </div>
    );
  }

  return (
    <div className="premium-card flex flex-col relative overflow-hidden group h-full">
      
      {/* Premium Badge & Profile No */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
         <div className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-xl rounded-full shadow-premium border border-border/40 animate-in fade-in zoom-in duration-1000">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[9px] font-black text-foreground uppercase tracking-[0.25em]">Authenticated</span>
         </div>
         {profile.profileNo && (
            <div className="px-5 py-2 bg-accent/90 backdrop-blur-md text-white rounded-full text-[9px] font-black tracking-[0.25em] uppercase border border-white/20 w-fit shadow-premium">
               {profile.profileNo}
            </div>
         )}
      </div>

      <FavoriteButton profile={profile} />

      {/* Image Section */}
      <div className="h-[22rem] bg-secondary relative overflow-hidden">
        {/* Divine Identity Badge */}
        <div className={`absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2 shadow-premium transition-transform group-hover:scale-105 ${
          profile.gender === 'female' 
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' 
          : 'bg-primary/10 border-primary/20 text-primary'
        }`}>
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${profile.gender === 'female' ? 'bg-rose-500' : 'bg-primary'}`}></div>
           <span className="text-[10px] font-black uppercase tracking-widest">
             {profile.gender === 'female' ? 'Bride Portfolio' : 'Groom Portfolio'}
           </span>
        </div>

        <Avatar 
          src={profile.imageUrl} 
          name={profile.name} 
          isRevealed={isFieldVisible('imageUrl', profile, isRevealed)} 
          size="xl" 
          className="w-full h-full rounded-none border-none shadow-none" 
        />
        
        {/* Elegant Gradient Overlays */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent opacity-100 transition-opacity duration-700"></div>
        
        {/* Profile Identity Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-black text-3xl text-foreground tracking-tighter truncate font-serif italic drop-shadow-sm">{displayName}</h3>
            <div className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-premium shrink-0">
               {age} YRS
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
             <span>{profile.maritalStatus}</span>
             <div className="w-1.5 h-1.5 bg-accent/40 rounded-full"></div>
             <span className="truncate">{profile.religion}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-8 flex flex-col grow space-y-8 bg-card relative">
        <div className="grid grid-cols-1 gap-6">
           {/* Profession */}
           <div className="flex items-center gap-5 group/info">
               <div className="w-12 h-12 bg-secondary text-muted-foreground rounded-2xl flex items-center justify-center shrink-0 group-hover/info:bg-primary group-hover/info:text-white transition-all duration-700 shadow-sm border border-border/50">
                  <Briefcase size={18} />
               </div>
               <div className="min-w-0">
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-2">Vocation</p>
                  <p className="text-foreground font-black leading-tight truncate text-sm">
                     {profile.profession || 'Not Specified'}
                  </p>
               </div>
           </div>

           {/* Location */}
           <div className="flex items-center gap-5 group/info">
               <div className="w-12 h-12 bg-secondary text-muted-foreground rounded-2xl flex items-center justify-center shrink-0 group-hover/info:bg-accent group-hover/info:text-white transition-all duration-700 shadow-sm border border-border/50">
                  <MapPin size={18} />
               </div>
               <div className="min-w-0">
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-2">Provenance</p>
                  <p className="text-foreground font-black truncate text-sm leading-tight">
                     {profile.city || 'Undisclosed'}
                     {profile.state && <span className="text-muted-foreground/60 font-bold ml-1.5">• {profile.state}</span>}
                  </p>
               </div>
           </div>
        </div>

        {/* Premium Action Area */}
        <div className="pt-2">
           <Link 
              href={`/profile/${profile.id}`}
              className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl bg-primary text-white font-black hover:shadow-lift transition-all shadow-premium active:scale-[0.97] text-[11px] uppercase tracking-[0.4em] border border-primary/20 relative overflow-hidden group/btn"
           >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700"></div>
              <span className="relative">View Bio-Data</span> <ArrowUpRight size={16} className="relative group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
           </Link>
           <p className="mt-4 text-center text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Sparkles size={8} className="text-accent" /> Secured by Community Trust Desk
           </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileCard;
