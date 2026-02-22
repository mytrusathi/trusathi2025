import React from 'react';
import Image from 'next/image';
import { Profile } from '../types/profile';
import { MapPin, Briefcase, User, Calendar } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group h-full flex flex-col">
      {/* Image Section */}
      <div className="h-64 bg-slate-100 relative overflow-hidden">
        {profile.imageUrl ? (
          <Image
            src={profile.imageUrl}
            alt={profile.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <User size={64} strokeWidth={1.5} />
            <span className="text-sm mt-2 font-medium">No Photo Available</span>
          </div>
        )}
        
        {/* Overlay Gradient for Text Readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent"></div>
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-xl truncate mb-1">{profile.name}</h3>
          <div className="flex items-center gap-3 text-sm text-white/90">
             <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                <Calendar size={12} /> {age} yrs
             </span>
             <span className="truncate">{profile.religion}, {profile.caste}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col grow space-y-4">
        
        {/* Profession */}
        <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg mt-0.5">
                <Briefcase size={16} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Profession</p>
                <p className="text-slate-800 font-medium leading-tight">
                    {profile.profession || 'Not Specified'}
                    {profile.company && <span className="text-slate-500 text-sm block mt-0.5">at {profile.company}</span>}
                </p>
            </div>
        </div>

        {/* Location (Fixed Error Here) */}
        <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5">
                <MapPin size={16} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</p>
                <p className="text-slate-800 font-medium">
                    {profile.city || 'Unknown City'}
                    {profile.state && `, ${profile.state}`}
                </p>
            </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
         <button className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm text-sm">
            View Full Profile
         </button>
      </div>
    </div>
  );
};

export default PublicProfileCard;