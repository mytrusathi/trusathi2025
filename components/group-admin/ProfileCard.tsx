import React from 'react';
import Image from 'next/image';
import { Profile } from '../../types/profile';
import { Edit, Trash2, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';

interface Props {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, isPublic: boolean) => void;
}

const ProfileCard = ({ profile, onEdit, onDelete, onToggleVisibility }: Props) => {
  
  // Helper: Calculate Age
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
  const isPublic = profile.isPublic !== false;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Top Section: Image & Basic Info */}
      <div className="p-4 flex gap-4 items-start">
        <div className="relative w-16 h-16 rounded-full bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
          {profile.imageUrl ? (
            <Image src={profile.imageUrl} alt={profile.name} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
              No Pic
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <h3 className="font-bold text-slate-800 truncate pr-2">{profile.name}</h3>
             <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap">
               {age} Yrs
             </span>
          </div>
          <p className="text-xs text-rose-600 font-medium truncate mb-1">
            {profile.religion}, {profile.caste}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 truncate mb-2">
             <MapPin size={12} />
             {profile.city || 'Unknown City'}
          </div>
          {onToggleVisibility && (
            <span className={`inline-flex text-[11px] font-semibold px-2 py-1 rounded-md ${isPublic ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {isPublic ? 'Visible to public' : 'Hidden from public'}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Profession */}
      <div className="px-4 pb-4 grow">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
             <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 uppercase font-bold tracking-wide">
                <Briefcase size={12} /> Profession
             </div>
             <p className="text-sm font-medium text-slate-700 line-clamp-2">
                {profile.profession || 'Not Specified'} 
                {profile.company && <span className="text-slate-500"> at {profile.company}</span>}
             </p>
             <p className="text-xs text-slate-500 mt-1">{profile.income || 'Income hidden'}</p>
          </div>
      </div>

      {/* Bottom: Actions */}
      <div className="border-t border-slate-100 p-3 flex gap-2 bg-slate-50/50">
        {onToggleVisibility && (
          <button
            onClick={() => {
              if (profile.id) onToggleVisibility(profile.id, !isPublic);
            }}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isPublic
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            }`}
            title={isPublic ? 'Hide from public community pages' : 'Show on public community pages'}
          >
            {isPublic ? <EyeOff size={14} /> : <Eye size={14} />}
            {isPublic ? 'Hide' : 'Show'}
          </button>
        )}
        <button 
          onClick={() => onEdit(profile)}
          className="flex-1 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-2"
        >
          <Edit size={14} /> Edit
        </button>
        <button 
          onClick={() => {
            if (profile.id) onDelete(profile.id);
          }}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          title="Delete Profile"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
