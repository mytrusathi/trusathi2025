// components/group-admin/ProfileCard.tsx
import React from 'react';
import { MapPin, GraduationCap, Briefcase, Share2, Check, Edit, Trash2 } from 'lucide-react';
import { Profile } from '../../types/profile';

interface Props {
  profile: Profile;
  isCopied: boolean;
  onCopy: (profile: Profile) => void;
  onView: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (id: string) => void;
}

export const ProfileCard = ({ profile, isCopied, onCopy, onView, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-50">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{profile.name}</h3>
            <p className="text-rose-600 font-medium text-sm">{profile.profession}</p>
          </div>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
            {profile.age} Yrs
          </span>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{profile.location || 'Location N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <GraduationCap size={16} className="text-slate-400" />
            <span className="truncate">{profile.education}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase size={16} className="text-slate-400" />
            <span className="truncate">{profile.income || 'Income N/A'}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 bg-slate-50 mt-auto flex flex-col gap-3">
        {/* WhatsApp Button */}
        <button
          onClick={() => onCopy(profile)}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
            ${isCopied
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
            }
          `}
        >
          {isCopied ? <Check size={18} /> : <Share2 size={18} />}
          {isCopied ? 'Copied!' : 'Copy for WhatsApp'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onView(profile)}
            className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            View Full
          </button>
          <button
            onClick={() => onEdit(profile)}
            className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(profile.id!)}
            className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};