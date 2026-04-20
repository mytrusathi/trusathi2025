"use client";

import React from 'react';
import Image from 'next/image';
import { 
  MapPin, Briefcase, Calendar, Ruler, Heart, 
  GraduationCap, Building2, 
  Baby, Home, User, Shield, ShieldCheck, Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileActions, { FavoriteButton } from '@/components/ProfileActions';
import { Profile } from '@/types/profile';
import { useProfileReveal } from '@/hooks/useProfileReveal';
import { isFieldVisible, maskName } from '@/app/lib/privacy-utils';
import Avatar from '@/components/ui/Avatar';

interface Props {
  profile: Profile;
  age: string | number;
  creatorName: string;
  managedByGroup: string;
}

export default function ClientProfileView({ profile, age, creatorName, managedByGroup }: Props) {
  const { isRevealed, loading } = useProfileReveal(profile);
  const managerLabel = managedByGroup ? `${managedByGroup} (${creatorName})` : creatorName;
  
  const canSeeName = isFieldVisible('name', profile, isRevealed);
  const displayName = canSeeName ? profile.name : maskName(profile.name);
  
  const getVal = (field: string, actual: any, placeholder = 'Restricted') => {
     return isFieldVisible(field, profile, isRevealed) ? actual : placeholder;
  };

  const aboutText = isRevealed 
    ? (profile.about || `Hello, this is ${profile.name}. I am looking for a life partner.`)
    : `Identity Protected. This candidate's personal biography is hidden until a connection is established. Connect to learn more about ${displayName}.`;

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
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          
          {/* Header/Banner Section with Masked Identity */}
          <div className="relative h-64 md:h-96 bg-indigo-950 overflow-hidden">
             <Avatar 
               src={profile.imageUrl} 
               name={profile.name} 
               isRevealed={isRevealed} 
               size="xl" 
               className="w-full h-full rounded-none border-none opacity-40 grayscale" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent"></div>
             
             <div className="absolute top-8 right-8 z-30 no-print">
                <FavoriteButton profile={profile} />
             </div>
             
             <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-20">
                <div className="flex items-center gap-6">
                   <Avatar 
                     src={profile.imageUrl} 
                     name={profile.name} 
                     isRevealed={isRevealed} 
                     size="xl" 
                     className="w-24 h-24 md:w-40 md:h-40 border-4 border-white shadow-2xl bg-white" 
                   />
                   <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-4 py-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2 shadow-premium transition-transform ${
                          profile.gender === 'female' 
                          ? 'bg-rose-500/20 border-rose-500/30 text-rose-100' 
                          : 'bg-amber-500/20 border-amber-500/30 text-amber-100'
                        }`}>
                           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${profile.gender === 'female' ? 'bg-rose-400' : 'bg-amber-400'}`}></div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                             {profile.gender === 'female' ? 'Bride of TRUSATHI' : 'Groom of TRUSATHI'}
                           </span>
                        </div>
                        {!isRevealed && (
                          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                            <Lock size={12} /> Identity Protected
                          </span>
                        )}
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black tracking-tight font-serif italic mb-3">{displayName}</h1>
                      <div className="flex flex-wrap items-center gap-6 mt-4 text-white/60 font-bold text-sm tracking-wide">
                         <span className="flex items-center gap-2"><Calendar size={20} className="text-primary" /> {age} Cycles</span>
                         <span className="flex items-center gap-2"><MapPin size={20} className="text-accent" /> {getVal('city', profile.city, 'Location Masked')}</span>
                      </div>
                   </div>
                </div>
                 <div className="flex items-center gap-3 no-print">
                    {profile.profileNo && (
                      <div className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">
                         TRUSATHI {profile.profileNo}
                      </div>
                    )}
                 </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
             
             {/* Main Details */}
             <div className="lg:col-span-2 p-8 md:p-12 space-y-12">
                
                {/* About Section */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                         <div className="w-2 h-8 bg-indigo-600 rounded-full"></div> Personal Story
                      </h2>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Curated By</p>
                         <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{managerLabel}</p>
                      </div>
                   </div>
                   <div className={`p-8 rounded-[2.5rem] border border-slate-100 ${!isRevealed ? 'bg-slate-50 italic text-slate-500' : 'bg-white shadow-sm shadow-indigo-100/50'}`}>
                      <p className="leading-relaxed text-lg whitespace-pre-line">
                         {aboutText}
                      </p>
                   </div>
                </section>

                {/* Personal & Professional Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <InfoGroup title="Profile Identity" icon={<User className="text-primary" />}>
                      <InfoItem label="Matrimonial Role" value={profile.gender === 'female' ? 'Bride Portfolio' : 'Groom Portfolio'} />
                      <InfoItem label="Religion" value={profile.religion} />
                      <InfoItem label="Caste" value={getVal('caste', profile.caste, 'Family Masked')} />
                      <InfoItem label="Marital Status" value={profile.maritalStatus} />
                      <InfoItem label="Height" value={profile.height} />
                   </InfoGroup>

                   <InfoGroup title="Education & Career" icon={<Briefcase className="text-emerald-500" />}>
                      <InfoItem label="Education" value={profile.education} />
                      <InfoItem label="Profession" value={profile.profession} />
                      <InfoItem label="Company" value={getVal('company', profile.company, 'Confidential')} />
                      <InfoItem label="Annual Income" value={getVal('income', profile.income, 'Protected')} />
                   </InfoGroup>
                </section>

                {/* Family Details - High Privacy Zone */}
                 <section className="md:col-span-2 bg-background/50 rounded-[3rem] p-8 md:p-12 border border-border/50 relative overflow-hidden group/family">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover/family:bg-amber-500/10 transition-colors"></div>
                    
                    <h2 className="text-2xl md:text-3xl font-black mb-10 flex items-center gap-4 relative z-10 font-serif italic text-foreground">
                       <Home className="text-amber-500" /> Family Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10">
                       <InfoItem label="Father's Name" value={getVal('fatherName', profile.fatherName, 'Shielded')} />
                       <InfoItem label="Father's Occupation" value={getVal('fatherOccupation', profile.fatherOccupation, 'Shielded')} />
                       <InfoItem label="Mother's Name" value={getVal('motherName', profile.motherName, 'Shielded')} />
                       <InfoItem label="Siblings" value={profile.siblings} />
                       <InfoItem label="Family Type" value={profile.familyType} />
                    </div>
                    
                    {!isRevealed && (
                      <div className="mt-8 pt-8 border-t border-indigo-100/50 flex items-center gap-3 text-indigo-950/40 text-[10px] font-black uppercase tracking-widest">
                         <Lock size={14} /> Full family details revealed upon mutual connection
                      </div>
                    )}
                </section>
             </div>

             {/* Sidebar Info */}
             <div className="bg-slate-50/50 border-l border-slate-100 p-8 md:p-12 space-y-10">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-100/20 space-y-4">
                   <h3 className="font-black text-slate-800 flex items-center gap-2 tracking-tight">
                       <ShieldCheck className="text-emerald-500" size={24} /> Verified Member
                   </h3>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      This bio-data has been manually screened and verified by our Community Trust Desk to ensure a safe matchmaking experience.
                   </p>
                </div>

                <div className="space-y-6">
                   <h3 className="font-black text-slate-800 px-1 uppercase tracking-widest text-xs">Vital Statistics</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <QuickFact icon={<Ruler size={18}/>} label="Height" value={profile.height || 'N/A'} />
                      <QuickFact icon={<Building2 size={18}/>} label="Home City" value={isRevealed ? profile.city : 'Restricted'} />
                      <QuickFact icon={<GraduationCap size={18}/>} label="Education" value={profile.education} />
                   </div>
                </div>

                <div className="no-print pt-4">
                  <ProfileActions profile={profile} managerName={managerLabel} />
                </div>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <h3 className="font-black text-slate-800 flex items-center gap-3 text-xl tracking-tight">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">{icon}</div> {title}
      </h3>
      <div className="grid grid-cols-1 gap-6 px-1">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="group/item">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover/item:text-indigo-400 transition-colors">{label}</p>
      <p className={`text-slate-800 font-bold text-lg tracking-tight ${value === 'Restricted' || value === 'Protected' ? 'italic text-slate-400' : ''}`}>{value || 'Contact Curator'}</p>
    </div>
  );
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 group">
       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">{icon}</div>
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-sm font-black text-slate-800 leading-none">{value}</p>
       </div>
    </div>
  );
}
