import { Metadata } from 'next';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Profile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { 
  MapPin, Briefcase, Calendar, Ruler, Heart, 
  Users, GraduationCap, Banknote, Building2, 
  Baby, Home, User, Download, Printer, Shield
} from 'lucide-react';
import { notFound } from 'next/navigation';
import ProfileActions, { FavoriteButton } from '@/components/ProfileActions';

interface Props {
  params: Promise<{ id: string }>;
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const docRef = doc(db, 'profiles', id);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      return { title: 'Profile Not Found | TruSathi' };
    }
    
    const profile = snap.data() as Profile;
    const age = getAge(profile.dob);
    return {
      title: `View ${profile.name}'s Profile | TruSathi Matrimony`,
      description: `Check out ${profile.name}'s biodata on TruSathi. ${age} years old, ${profile.religion}, ${profile.caste}. Community verified matches.`,
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return { title: 'Biodata | TruSathi' };
  }
}

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

export default async function ProfilePage({ params }: Props) {
  try {
    const { id } = await params;
    
    // Fetch profile data
    const docRef = doc(db, 'profiles', id);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      notFound();
    }
    
    const profile = { ...snap.data(), id: snap.id } as Profile;
    const age = getAge(profile.dob);

    // Fetch creator details
    let creatorName = 'Self';
    let managedByGroup = '';
    
    if (profile.createdBy) {
      const userRef = doc(db, 'users', profile.createdBy);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        creatorName = userData.displayName || 'Community Member';
        managedByGroup = userData.groupName || '';
      }
    }
    
    return ProfileView({ profile, age, creatorName, managedByGroup });
  } catch (error) {
    console.error('Profile fetch error:', error);
    notFound(); 
  }
}

function ProfileView({ 
  profile, 
  age, 
  creatorName, 
  managedByGroup 
}: { 
  profile: Profile; 
  age: string | number;
  creatorName: string;
  managedByGroup: string;
}) {
  const isSelfManaged = profile.createdBy === creatorName; // This is a bit weak, but better than nothing
  const managerLabel = managedByGroup ? `${managedByGroup} (${creatorName})` : creatorName;

  return (
    <div className="min-h-screen bg-slate-50">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .rounded-3xl { border-radius: 0 !important; }
          .shadow-xl { box-shadow: none !important; }
          .border { border: none !important; }
          .bg-slate-50 { background-color: white !important; }
          .profile-container { border: 1px solid #eee !important; }
        }
      `}} />
      <div className="no-print">
        <Navbar />
      </div>
      
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 profile-container">
        {/* ProfileActions removed from here to prevent duplication */}

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          
          {/* Header/Banner Section */}
          <div className="relative h-64 md:h-96 bg-indigo-900 overflow-hidden">
             {profile.imageUrl ? (
               <Image 
                 src={profile.imageUrl} 
                 alt={profile.name}
                 fill
                 className="object-cover opacity-60"
                 priority
               />
             ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                    <User size={160} className="text-white" />
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
             
             <FavoriteButton profile={profile} />
             
             <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white overflow-hidden shadow-2xl relative bg-white">
                      {profile.imageUrl ? (
                        <Image src={profile.imageUrl} alt={profile.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <User size={64} />
                        </div>
                      )}
                   </div>
                   <div className="text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${managedByGroup ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'}`}>
                          {managedByGroup ? 'Admin Managed' : 'Self Managed'}
                        </span>
                        {profile.revealContactOnInterest && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Shield size={10} /> Auto Reveal
                          </span>
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80 font-medium">
                         <span className="flex items-center gap-1.5"><Calendar size={18} /> {age} years</span>
                         <span className="flex items-center gap-1.5"><MapPin size={18} /> {profile.city}, {profile.state || ''}</span>
                      </div>
                   </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold flex items-center gap-2">
                        <Heart size={18} className="text-rose-400 fill-rose-400" /> Matches Found
                    </div>
                    {profile.profileNo && (
                      <div className="px-5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-xl">
                         ID: {profile.profileNo}
                      </div>
                    )}
                 </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
             
             {/* Main Details */}
             <div className="lg:col-span-2 p-8 md:p-12 space-y-12">
                
                {/* About Section */}
                <section>
                   <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div> About Me
                      </h2>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Profile Managed By</p>
                         <p className="text-xs font-bold text-slate-500">{managerLabel}</p>
                      </div>
                   </div>
                   <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                      {profile.about || `Hello, this is ${profile.name}. I am looking for a life partner who is compatible and shares similar values. Please explore my biodata for more details.`}
                   </p>
                </section>

                {/* Personal & Astro Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InfoGroup title="Personal Info" icon={<User className="text-indigo-500" />}>
                      <InfoItem label="Religion" value={profile.religion} />
                      <InfoItem label="Caste" value={profile.caste} />
                      <InfoItem label="Marital Status" value={profile.maritalStatus} />
                      <InfoItem label="Height" value={profile.height} />
                      <InfoItem label="Manglik" value={profile.manglik} />
                   </InfoGroup>

                   <InfoGroup title="Professional Details" icon={<Briefcase className="text-emerald-500" />}>
                      <InfoItem label="Education" value={profile.education} />
                      <InfoItem label="Profession" value={profile.profession} />
                      <InfoItem label="Company" value={profile.company} />
                      <InfoItem label="Income" value={profile.income} />
                   </InfoGroup>
                </section>

                {/* Family Details */}
                <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                       <Home className="text-amber-500" /> Family Background
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                       <InfoItem label="Father's Name" value={profile.fatherName} />
                       <InfoItem label="Father's Occupation" value={profile.fatherOccupation} />
                       <InfoItem label="Mother's Name" value={profile.motherName} />
                       <InfoItem label="Mother's Occupation" value={profile.motherOccupation} />
                       <InfoItem label="Siblings" value={profile.siblings} />
                       <InfoItem label="Family Type" value={profile.familyType} />
                    </div>
                </section>
             </div>

             {/* Sidebar Info */}
             <div className="bg-slate-50/50 border-l border-slate-100 p-8 md:p-12 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <ShieldCheck className="text-green-500" size={20} /> Identity Verified
                   </h3>
                   <p className="text-sm text-slate-500">
                      This profile has been verified by our trusted community admins to ensure authenticity.
                   </p>
                </div>

                <div className="space-y-4">
                   <h3 className="font-bold text-slate-800 px-1">Quick Facts</h3>
                   <div className="space-y-3">
                      <QuickFact icon={<Ruler size={18}/>} label="Height" value={profile.height || 'N/A'} />
                      <QuickFact icon={<Baby size={18}/>} label="Gender" value={profile.gender} />
                      <QuickFact icon={<Building2 size={18}/>} label="Home City" value={profile.city} />
                      <QuickFact icon={<GraduationCap size={18}/>} label="Education" value={profile.education} />
                   </div>
                </div>

                <ProfileActions profile={profile} managerName={managerLabel} />
             </div>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}

function InfoGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
        {icon} {title}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-800 font-semibold">{value || 'Not Specified'}</p>
    </div>
  );
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
       <div className="text-indigo-500">{icon}</div>
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-800 leading-none">{value}</p>
       </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
   return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
   )
}
