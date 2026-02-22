"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../app/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Plus, Search, FilterX } from 'lucide-react';
import ProfileCard from './ProfileCard'; // Ensure no { } around this import
import ProfileForm from './ProfileForm';

const ProfileList = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'profiles'), where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedProfiles: Profile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProfiles.push({ ...doc.data(), id: doc.id } as Profile);
      });
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteDoc(doc(db, 'profiles', id));
        setProfiles(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProfile(null);
    fetchProfiles(); // Refresh list
  };

  // Filter logic
  const filteredProfiles = profiles.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    // Search by Name, City, or Caste
    return (
      (p.name?.toLowerCase() || '').includes(searchLower) ||
      (p.city?.toLowerCase() || '').includes(searchLower) ||
      (p.caste?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (showForm) {
    return (
      <ProfileForm 
        initialData={editingProfile}
        onSuccess={handleFormSuccess}
        onCancel={() => { setShowForm(false); setEditingProfile(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by name, city..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
           />
        </div>
        
        <button 
          onClick={() => { setEditingProfile(null); setShowForm(true); }}
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Profile
        </button>
      </div>

      {/* List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-rose-500 mb-2" size={32} />
          <p className="text-slate-400">Loading profiles...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
           <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FilterX className="text-slate-300" size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-700">No profiles found</h3>
           <p className="text-slate-500">
             {searchTerm ? `No matches for "${searchTerm}"` : "Get started by adding a new profile."}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile}
              onEdit={handleEdit}     // CORRECT: Only passing supported props
              onDelete={handleDelete} // CORRECT: Only passing supported props
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;