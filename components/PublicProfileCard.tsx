import React from 'react';
import Image from 'next/image';
import { Profile } from '../types/profile';
import { MapPin, Briefcase, User, Calendar, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  profile: Profile;
}

const PublicProfileCard = ({ profile }: Props) => {
  
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

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group h-full flex flex-col relative">
      
      {/* Premium Badge & Profile No */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Verified</span>
         </div>
         {profile.profileNo && (
            <div className="px-3 py-1 bg-slate-900/40 backdrop-blur-md text-white rounded-full text-[9px] font-black tracking-widest uppercase border border-white/10 w-fit">
               {profile.profileNo}
            </div>
         )}
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); alert('Please visit the full profile to mark as favorite!'); }}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-all shadow-lg"
      >
         <Heart size={18} />
      </button>

      {/* Image Section */}
      <div className="h-80 bg-slate-100 relative overflow-hidden">
        {profile.imageUrl ? (
          <Image
            src={profile.imageUrl}
            alt={profile.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50">
            <User size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Text Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-2xl text-white tracking-tight truncate">{profile.name}</h3>
            <div className="flex items-center gap-1.5 bg-rose-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-lg shadow-rose-900/20">
               {age} Yrs
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-200 text-sm font-medium">
             <span>{profile.maritalStatus}</span>
             <div className="w-1 h-1 bg-white/30 rounded-full"></div>
             <span className="truncate">{profile.religion}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex flex-col grow space-y-5 bg-white">
        
        <div className="flex flex-col gap-4">
           {/* Profession */}
           <div className="flex items-center gap-4 group/item">
               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors duration-300">
                  <Briefcase size={18} />
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Profession</p>
                  <p className="text-slate-800 font-bold leading-tight truncate">
                     {profile.profession || 'Not Specified'}
                  </p>
                  {profile.company && <p className="text-slate-500 text-xs truncate mt-0.5">at {profile.company}</p>}
               </div>
           </div>

           {/* Location */}
           <div className="flex items-center gap-4 group/item">
               <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors duration-300">
                  <MapPin size={18} />
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Home City</p>
                  <p className="text-slate-800 font-bold truncate">
                     {profile.city || 'Unknown City'}
                     {profile.state && <span className="text-slate-400 font-medium">, {profile.state}</span>}
                  </p>
               </div>
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
           <Link 
              href={`/profile/${profile.id}`}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm"
           >
              Full Biodata <ArrowUpRight size={18} />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileCard;