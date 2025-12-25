"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../app/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Plus, Edit, Trash2, Search, Share2, Check, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import ProfileForm from './ProfileForm';
import ProfileDetail from './ProfileDetail';

const ProfileList = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedProfiles: Profile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProfiles.push({ id: doc.id, ...doc.data() } as Profile);
      });
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'profiles', id));
        fetchProfiles();
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  const copyForWhatsApp = (profile: Profile) => {
    const waText = `
💍 *Matrimonial Profile* 💍

*Basic Details:*
👤 Name: ${profile.name}
🎂 Age: ${profile.age} Yrs
📏 Height: ${profile.height}
📍 Location: ${profile.location || 'Not Specified'}

*Professional & Education:*
🎓 Education: ${profile.education}
💼 Profession: ${profile.profession}
💰 Income: ${profile.income || 'N/A'}

*Family Background:*
🙏 Religion: ${profile.religion}
🕉️ Caste: ${profile.caste || 'N/A'}
👨‍👩‍👦 Father: ${profile.fatherName || 'N/A'} (${profile.fatherOccupation || ''})

*Contact:*
📞 ${profile.contact || 'Contact Admin'}

---------------------------------
*Shared via truSathi.com*
    `.trim();

    navigator.clipboard.writeText(waText).then(() => {
      setCopiedId(profile.id || 'temp');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredProfiles = profiles.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <ProfileForm 
        initialData={selectedProfile} 
        onSuccess={() => { setIsEditing(false); fetchProfiles(); }} 
        onCancel={() => setIsEditing(false)} 
      />
    );
  }

  if (viewingProfile) {
    return (
      <ProfileDetail 
        profile={viewingProfile} 
        onBack={() => setViewingProfile(null)}
        onEdit={() => {
            setSelectedProfile(viewingProfile);
            setViewingProfile(null);
            setIsEditing(true);
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Profiles</h1>
          <p className="text-slate-500 mt-1">Manage and share your biodata collection</p>
        </div>
        <button 
          onClick={() => { setSelectedProfile(null); setIsEditing(true); }}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-semibold"
        >
          <Plus size={20} /> Add New Profile
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Profiles</p>
              <p className="text-2xl font-bold text-slate-800">{profiles.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Shares</p>
              <p className="text-2xl font-bold text-slate-800">--</p>
          </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, city, or caste..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-rose-500 mb-3" size={40} />
            <p className="text-slate-500 font-medium">Loading your profiles...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No profiles found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first matrimonial profile."}
            </p>
            {!searchTerm && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-6 text-rose-600 font-semibold hover:text-rose-700"
                >
                  Create Profile Now &rarr;
                </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col">
               
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
                    onClick={() => copyForWhatsApp(profile)}
                    className={`
                        w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                        ${copiedId === profile.id
                            ? 'bg-green-600 text-white shadow-md' 
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                        }
                    `}
                 >
                    {copiedId === profile.id ? <Check size={18} /> : <Share2 size={18} />}
                    {copiedId === profile.id ? 'Copied!' : 'Copy for WhatsApp'}
                 </button>

                 <div className="flex gap-2">
                    <button 
                        onClick={() => setViewingProfile(profile)}
                        className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        View Full
                    </button>
                    <button 
                        onClick={() => { setSelectedProfile(profile); setIsEditing(true); }}
                        className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(profile.id!)}
                        className="w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;