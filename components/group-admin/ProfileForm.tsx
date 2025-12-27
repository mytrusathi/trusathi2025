
"use client";

import React, { useState, useEffect } from 'react';
import { db, storage } from '../../app/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Upload, X, Save, User, MapPin, Briefcase, Users, Star } from 'lucide-react';

interface Props {
  initialData?: Profile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProfileForm = ({ initialData, onSuccess, onCancel }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initial State matches our new TypeScript Interface
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    gender: 'female',
    dob: '',
    tob: '',
    pob: '',
    height: '',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: '',
    subCaste: '',
    gotra: '',
    manglik: 'No',
    education: '',
    profession: '',
    company: '',
    income: '',
    city: '',
    state: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: '',
    familyType: 'Nuclear',
    contact: '',
    about: '',
    imageUrl: '',
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewUrl(initialData.imageUrl || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // 1. Upload Image if changed
      if (imageFile) {
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Prepare Data
      const profileData = {
        ...formData,
        imageUrl,
        createdBy: user.uid,
        updatedAt: new Date().toISOString(),
        // Ensure name is searchable
        nameLowerCase: formData.name?.toLowerCase(),
      };

      // 3. Save to Firestore
      if (initialData?.id) {
        await updateDoc(doc(db, 'profiles', initialData.id), profileData);
      } else {
        await addDoc(collection(db, 'profiles'), {
          ...profileData,
          createdAt: new Date().toISOString(),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto my-4 md:my-8 flex flex-col h-[90vh] md:h-auto">
      
      {/* Header */}
      <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center sticky top-0 z-10">
        <div>
           <h2 className="text-xl font-bold text-indigo-900">
             {initialData ? 'Edit Profile' : 'Create New Profile'}
           </h2>
           <p className="text-xs text-indigo-600">Fill in the details to create a shareable biodata</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-white text-slate-500 hover:text-red-600 rounded-full shadow-sm hover:shadow transition-all">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Photo & Key Info (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                    <User className="text-slate-300" size={64} />
                    )}
                </div>
                <div className="absolute bottom-0 right-2 bg-rose-600 text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                   <Upload size={16} />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium">Click to upload photo</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
               <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 mb-2">Contact Info</h3>
               <Input label="Mobile Number" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 98765..." required />
               <Input label="Residing City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" />
            </div>
          </div>

          {/* RIGHT COLUMN: Detailed Form (9 cols) */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* 1. Basic Details */}
            <Section title="Basic Details" icon={<User size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <Input label="Height" name="height" value={formData.height} onChange={handleChange} placeholder="5'10&quot;" />
                </div>
                <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                <div>
                   <label className="label">Marital Status</label>
                   <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-field">
                     <option value="Never Married">Never Married</option>
                     <option value="Divorced">Divorced</option>
                     <option value="Widowed">Widowed</option>
                   </select>
                </div>
              </div>
            </Section>

            {/* 2. Religious & Horoscope */}
            <Section title="Religious & Horoscope" icon={<Star size={18} />}>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                  <Input label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
                  <Input label="Gotra" name="gotra" value={formData.gotra} onChange={handleChange} />
                  
                  <Input label="Time of Birth" name="tob" type="time" value={formData.tob} onChange={handleChange} />
                  <Input label="Place of Birth" name="pob" value={formData.pob} onChange={handleChange} />
                  <div>
                    <label className="label">Manglik?</label>
                    <select name="manglik" value={formData.manglik} onChange={handleChange} className="input-field">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="Anshik">Anshik (Partial)</option>
                        <option value="Don't Know">Don't Know</option>
                    </select>
                  </div>
               </div>
            </Section>

            {/* 3. Professional */}
            <Section title="Education & Career" icon={<Briefcase size={18} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Highest Education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBA, B.Tech" />
                    <Input label="Profession / Job Title" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" />
                    <Input label="Company Name" name="company" value={formData.company} onChange={handleChange} />
                    <Input label="Annual Income" name="income" value={formData.income} onChange={handleChange} placeholder="e.g. 12 LPA" />
                </div>
            </Section>

            {/* 4. Family */}
            <Section title="Family Background" icon={<Users size={18} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                    <Input label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
                    <Input label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                    <Input label="Mother's Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
                    <Input label="Siblings (Brothers/Sisters)" name="siblings" value={formData.siblings} onChange={handleChange} placeholder="1 Brother, 1 Sister" className="md:col-span-2" />
                </div>
            </Section>
            
            {/* About */}
            <div>
               <label className="label">About Candidate / Additional Notes</label>
               <textarea 
                  name="about" 
                  value={formData.about} 
                  onChange={handleChange} 
                  rows={4}
                  className="input-field"
                  placeholder="Write a short summary about the person's personality and what they are looking for..."
               />
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white p-4 md:static">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-rose-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Profile' : 'Save Biodata'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="text-rose-500">{icon}</span> {title}
        </h3>
        {children}
    </div>
);

const Input = ({ label, className, ...props }: any) => (
  <div className={className}>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
    <input 
      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
      {...props}
    />
  </div>
);

export default ProfileForm;