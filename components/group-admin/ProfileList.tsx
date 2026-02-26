"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../app/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Plus, Search, FilterX, SlidersHorizontal, Users, Eye, EyeOff } from 'lucide-react';
import ProfileCard from './ProfileCard'; // Ensure no { } around this import
import ProfileForm from './ProfileForm';

const ProfileList = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [religionFilter, setReligionFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'hidden'>('all');
  
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

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    try {
      await updateDoc(doc(db, 'profiles', id), { isPublic, updatedAt: new Date().toISOString() });
      setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, isPublic } : p)));
    } catch (error) {
      console.error('Visibility update error:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProfile(null);
    fetchProfiles(); // Refresh list
  };

  const religions = Array.from(new Set(profiles.map((p) => (p.religion || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const cities = Array.from(new Set(profiles.map((p) => (p.city || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  // Filter logic
  const filteredProfiles = profiles.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (p.name?.toLowerCase() || '').includes(searchLower) ||
      (p.city?.toLowerCase() || '').includes(searchLower) ||
      (p.caste?.toLowerCase() || '').includes(searchLower) ||
      (p.profession?.toLowerCase() || '').includes(searchLower)
    );

    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesReligion = religionFilter === 'all' || p.religion === religionFilter;
    const matchesCity = cityFilter === 'all' || p.city === cityFilter;
    const isPublic = p.isPublic !== false;
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && isPublic) ||
      (visibilityFilter === 'hidden' && !isPublic);

    return matchesSearch && matchesGender && matchesReligion && matchesCity && matchesVisibility;
  });

  const totalProfiles = profiles.length;
  const publicProfiles = profiles.filter((p) => p.isPublic !== false).length;
  const hiddenProfiles = totalProfiles - publicProfiles;

  const clearFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setReligionFilter('all');
    setCityFilter('all');
    setVisibilityFilter('all');
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<Users size={16} />} label="Total Profiles" value={totalProfiles} />
        <StatCard icon={<Eye size={16} />} label="Public" value={publicProfiles} tone="green" />
        <StatCard icon={<EyeOff size={16} />} label="Hidden" value={hiddenProfiles} tone="amber" />
      </div>
      
      {/* Header Actions */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search name, city, caste, profession..." 
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <FilterSelect
            value={genderFilter}
            onChange={(value) => setGenderFilter(value as 'all' | 'male' | 'female')}
            options={[
              { label: 'All Genders', value: 'all' },
              { label: 'Female', value: 'female' },
              { label: 'Male', value: 'male' },
            ]}
          />
          <FilterSelect
            value={religionFilter}
            onChange={setReligionFilter}
            options={[
              { label: 'All Religions', value: 'all' },
              ...religions.map((value) => ({ label: value, value })),
            ]}
          />
          <FilterSelect
            value={cityFilter}
            onChange={setCityFilter}
            options={[
              { label: 'All Cities', value: 'all' },
              ...cities.map((value) => ({ label: value, value })),
            ]}
          />
          <FilterSelect
            value={visibilityFilter}
            onChange={(value) => setVisibilityFilter(value as 'all' | 'public' | 'hidden')}
            options={[
              { label: 'All Visibility', value: 'all' },
              { label: 'Public', value: 'public' },
              { label: 'Hidden', value: 'hidden' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <SlidersHorizontal size={14} />
            Showing {filteredProfiles.length} of {totalProfiles} profiles
          </p>
          <button onClick={clearFilters} className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">
            Clear filters
          </button>
        </div>
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
              onToggleVisibility={handleToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const StatCard = ({
  icon,
  label,
  value,
  tone = 'slate',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: 'slate' | 'green' | 'amber';
}) => {
  const toneClass =
    tone === 'green'
      ? 'bg-green-50 border-green-200 text-green-700'
      : tone === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-700'
      : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default ProfileList;
