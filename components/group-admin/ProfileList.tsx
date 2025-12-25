// components/group-admin/ProfileList.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../app/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Plus, Search } from 'lucide-react';
import ProfileForm from './ProfileForm';
import ProfileDetail from './ProfileDetail';
import { ProfileCard } from './ProfileCard'; // Import the new component

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
    if (confirm('Are you sure you want to delete this profile?')) {
      await deleteDoc(doc(db, 'profiles', id));
      fetchProfiles();
    }
  };

  const copyForWhatsApp = (profile: Profile) => {
    const waText = `
💍 *Matrimonial Profile* 💍
Name: ${profile.name}
Age: ${profile.age} | Height: ${profile.height}
Job: ${profile.profession}
Location: ${profile.location}
---------------------------------
*Contact:* ${profile.contact || 'Ask Admin'}
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Profiles</h1>
          <p className="text-slate-500 mt-1">Manage and share your biodata collection</p>
        </div>
        <button
          onClick={() => { setSelectedProfile(null); setIsEditing(true); }}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-md font-semibold"
        >
          <Plus size={20} /> Add New Profile
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-rose-500" size={40} /></div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
           <p className="text-slate-500">No profiles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isCopied={copiedId === profile.id}
              onCopy={copyForWhatsApp}
              onView={setViewingProfile}
              onEdit={(p) => { setSelectedProfile(p); setIsEditing(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;