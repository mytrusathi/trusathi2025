import React from 'react';
import { Profile } from '../../types/profile';
import { 
  X, MapPin, Calendar, User, Phone, 
  Heart, Star, GraduationCap, Users 
} from 'lucide-react';

interface Props {
  profile: Profile;
  onClose: () => void;
}

const ProfileDetail = ({ profile, onClose }: Props) => {
  
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header Section with Image */}
        <div className="relative h-64 bg-slate-800 shrink-0">
          {profile.imageUrl ? (
            <img 
               src={profile.imageUrl} 
               alt={profile.name} 
               className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200">
               <User size={64} />
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
             <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
             <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar size={14} /> {age} Years
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin size={14} /> {profile.city}{profile.state ? `, ${profile.state}` : ''}
                </span>
                <span className="bg-rose-600/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    {profile.religion}, {profile.caste}
                </span>
             </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 bg-slate-50">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                 
                 <DetailSection title="Personal Details" icon={<User size={18} />}>
                    <DetailRow label="Gender" value={profile.gender} capitalize />
                    <DetailRow label="Marital Status" value={profile.maritalStatus} />
                    <DetailRow label="Height" value={profile.height} />
                    <DetailRow label="Date of Birth" value={profile.dob} />
                 </DetailSection>

                 <DetailSection title="Religious Info" icon={<Star size={18} />}>
                    <DetailRow label="Religion" value={profile.religion} />
                    <DetailRow label="Caste" value={profile.caste} />
                    <DetailRow label="Gotra" value={profile.gotra || '-'} />
                    <DetailRow label="Manglik" value={profile.manglik || '-'} />
                    <DetailRow label="Time of Birth" value={profile.tob || '-'} />
                    <DetailRow label="Place of Birth" value={profile.pob || '-'} />
                 </DetailSection>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                 
                 <DetailSection title="Career & Education" icon={<GraduationCap size={18} />}>
                    <DetailRow label="Education" value={profile.education} />
                    <DetailRow label="Profession" value={profile.profession} />
                    <DetailRow label="Company" value={profile.company || '-'} />
                    <DetailRow label="Annual Income" value={profile.income || '-'} />
                 </DetailSection>

                 <DetailSection title="Family Details" icon={<Users size={18} />}>
                    <DetailRow label="Father" value={profile.fatherName} />
                    <DetailRow label="Father's Job" value={profile.fatherOccupation} />
                    <DetailRow label="Mother" value={profile.motherName} />
                    <DetailRow label="Mother's Job" value={profile.motherOccupation} />
                    <DetailRow label="Siblings" value={profile.siblings || '-'} />
                 </DetailSection>

                 <DetailSection title="Contact Info" icon={<Phone size={18} />}>
                    <div className="text-lg font-bold text-slate-800">{profile.contact}</div>
                    <div className="text-sm text-slate-500 mt-1">Available for inquiries</div>
                 </DetailSection>

              </div>
           </div>

           {/* About Section */}
           {profile.about && (
             <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                   <Heart size={18} className="text-rose-500" /> About Candidate
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                   {profile.about}
                </p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const DetailSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-full">
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-rose-500">{icon}</span> {title}
        </h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const DetailRow = ({ label, value, capitalize }: { label: string, value?: string, capitalize?: boolean }) => (
    <div className="flex justify-between items-start text-sm">
        <span className="text-slate-500 font-medium shrink-0">{label}</span>
        <span className={`text-slate-800 font-semibold text-right ${capitalize ? 'capitalize' : ''}`}>
            {value || 'N/A'}
        </span>
    </div>
);

export default ProfileDetail;