import React from 'react';
import Image from 'next/image';
import { Profile } from '../types/profile';
import { MapPin, Briefcase, User, ShieldCheck, ArrowUpRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FavoriteButton } from './ProfileActions';

interface Props {
  profile: Profile;
}

const PublicProfileCard = ({ profile }: Props) => {
  const { user } = useAuth();
  
  // Privacy Logic: Mask if not public and user not authorized
  const isOwner = user?.uid === profile.createdBy;
  const isMasked = !isOwner && profile.privacyLevel === 'Private';
  const isMembersOnly = profile.privacyLevel === 'MembersOnly' && !user;

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
  const displayName = isMasked ? (profile.name.split(' ')[0] + ' ***') : profile.name;

  if (isMembersOnly) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm min-h-[400px]">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
            <Lock size={36} />
         </div>
         <div className="space-y-2">
            <h3 className="font-black text-slate-800 tracking-tight text-xl">Members Only Content</h3>
            <p className="text-slate-500 text-sm font-medium">This profile is only visible to logged-in members of TruSathi community.</p>
         </div>
         <Link href="/login" className="px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Sign in to View</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 group h-full flex flex-col relative">
      
      {/* Premium Badge & Profile No */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
         <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-white/50 animate-in fade-in zoom-in duration-700">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Authenticated</span>
         </div>
         {profile.profileNo && (
            <div className="px-4 py-1.5 bg-slate-900/60 backdrop-blur-md text-white rounded-full text-[9px] font-black tracking-widest uppercase border border-white/10 w-fit">
               {profile.profileNo}
            </div>
         )}
      </div>

      <FavoriteButton profile={profile} />

      {/* Image Section */}
      <div className="h-80 bg-slate-100 relative overflow-hidden">
        {profile.imageUrl ? (
          <Image
            src={profile.imageUrl}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-1000 ${isMasked ? 'blur-2xl grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50">
            <User size={80} strokeWidth={1} />
          </div>
        )}

        {isMasked && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5">
             <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                Photo Restricted
             </div>
          </div>
        )}
        
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
        
        {/* Text Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-black text-2xl text-white tracking-tight truncate drop-shadow-md">{displayName}</h3>
            <div className="flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg shadow-rose-950/40 shrink-0">
               {age} Yrs
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-200 text-sm font-bold">
             <span className="opacity-90">{profile.maritalStatus}</span>
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
             <span className="truncate opacity-90">{profile.religion}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-8 flex flex-col grow space-y-6 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        
        <div className="flex flex-col gap-5">
           {/* Profession */}
           <div className="flex items-center gap-4 group/item">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-500 shadow-sm border border-indigo-100/50">
                  <Briefcase size={20} />
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Profession</p>
                  <p className="text-slate-800 font-black leading-tight truncate text-sm">
                     {profile.profession || 'Not Specified'}
                  </p>
                  {profile.occupationCategory && <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider mt-0.5">{profile.occupationCategory}</p>}
               </div>
           </div>

           {/* Location */}
           <div className="flex items-center gap-4 group/item">
               <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white transition-all duration-500 shadow-sm border border-rose-100/50">
                  <MapPin size={20} />
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Home City</p>
                  <p className="text-slate-800 font-black truncate text-sm">
                     {profile.city || 'Unknown City'}
                     {profile.state && <span className="text-slate-400 font-bold ml-1">, {profile.state}</span>}
                  </p>
               </div>
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
           <Link 
              href={`/profile/${profile.id}`}
              className="w-full flex items-center justify-center gap-3 py-4.5 rounded-[1.25rem] bg-slate-950 text-white font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] text-[13px] uppercase tracking-widest"
           >
              Full Biodata <ArrowUpRight size={18} />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileCard;
