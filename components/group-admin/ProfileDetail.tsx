import React from 'react';
import { Profile } from '../../types/profile';
import { ArrowLeft, Edit, MapPin, Briefcase, GraduationCap, Phone, User, Calendar, Heart } from 'lucide-react';

interface Props {
  profile: Profile;
  onBack: () => void;
  onEdit: () => void; // Added onEdit prop
}

const ProfileDetail = ({ profile, onBack, onEdit }: Props) => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
            <ArrowLeft size={20} /> Back to List
        </button>
        <button 
            onClick={onEdit}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors shadow-sm"
        >
            <Edit size={18} /> Edit Profile
        </button>
      </div>
      
      {/* Main Biodata Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Banner */}
        <div className="bg-linear-to-r from-rose-600 to-rose-500 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Photo Placeholder */}
                <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm">
                    {profile.imageUrl ? (
                        <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={64} className="text-white/80" />
                    )}
                </div>
                
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-rose-100 text-lg font-medium mb-4">{profile.profession}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Calendar size={14} /> {profile.age} Years
                        </span>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <MapPin size={14} /> {profile.location}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                
                <Section title="Personal Details" icon={<User size={18} />}>
                    <InfoRow label="Age" value={`${profile.age} Years`} />
                    <InfoRow label="Height" value={profile.height} />
                    <InfoRow label="Gender" value={profile.gender} capitalize />
                    <InfoRow label="Location" value={profile.location} />
                </Section>

                <Section title="Education & Career" icon={<Briefcase size={18} />}>
                    <InfoRow label="Education" value={profile.education} />
                    <InfoRow label="Profession" value={profile.profession} />
                    <InfoRow label="Annual Income" value={profile.income} />
                </Section>

                <Section title="Family Background" icon={<Heart size={18} />}>
                    <InfoRow label="Father's Name" value={profile.fatherName} />
                    <InfoRow label="Father's Job" value={profile.fatherOccupation} />
                    <InfoRow label="Religion" value={profile.religion} />
                    <InfoRow label="Caste" value={profile.caste} />
                </Section>

                <Section title="Contact Information" icon={<Phone size={18} />}>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Mobile Number</p>
                        <p className="text-xl font-bold text-slate-800">{profile.contact}</p>
                        <p className="text-xs text-slate-400 mt-2">Visible to authorized members only</p>
                    </div>
                </Section>

            </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-slate-400 text-sm">Profile ID: {profile.id}</p>
        </div>
      </div>
    </div>
  );
};

// Helper Components for Cleaner Layout
const Section = ({ title, icon, children }: any) => (
    <div>
        <div className="flex items-center gap-2 mb-4 text-rose-600 border-b border-rose-100 pb-2">
            {icon}
            <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value, capitalize }: any) => (
    <div className="flex justify-between items-baseline">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <span className={`text-slate-800 font-semibold text-right ${capitalize ? 'capitalize' : ''}`}>
            {value || <span className="text-slate-300 italic">Not Added</span>}
        </span>
    </div>
);

export default ProfileDetail;