import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { Profile } from '../types/profile';

export default function PublicProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              profile.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{profile.name}</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
              Community Verified
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-rose-500" />
            <span>{profile.profession || 'Not Specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-rose-500" />
            <span>{profile.location || 'India'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
        <span className="text-rose-600 font-bold text-sm group-hover:underline">View Full Profile &rarr;</span>
      </div>
    </div>
  )
}