"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db, storage } from '../../app/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { 
  Loader2, Upload, X, Save, User, MapPin, Briefcase, 
  Users, Star, ChevronDown, Ruler, Heart, Calendar 
} from 'lucide-react';

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

  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    gender: 'female',
    dob: '',
    tob: '',
    pob: '',
    height: '', // Now handled by dropdown
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
    isPublic: true,
  });

  // --- HEIGHT GENERATOR ---
  // Generates options from 4ft 0in to 7ft 0in
  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break; // Stop at 7ft 0in
      heightOptions.push(`${ft}ft ${inch}in`);
    }
  }

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

      if (imageFile) {
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const profileData = {
        ...formData,
        imageUrl,
        createdBy: user.uid,
        updatedAt: new Date().toISOString(),
        nameLowerCase: formData.name?.toLowerCase(), 
        isPublic: formData.isPublic ?? true,
      };

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
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-w-5xl mx-auto my-4 md:my-8 flex flex-col h-[90vh] md:h-auto">
      
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
             {initialData ? 'Edit Profile' : 'Create New Profile'}
           </h2>
           <p className="text-sm text-slate-500">Fill in the details to create a shareable biodata</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Photo Upload */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4">
                <div className="relative w-48 h-48 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill sizes="192px" className="object-cover" unoptimized />
                    ) : (
                    <User className="text-slate-300" size={80} />
                    )}
                </div>
                <div className="absolute bottom-2 right-4 bg-rose-600 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                   <Upload size={20} />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                />
              </div>
              <p className="text-sm font-bold text-slate-700">Profile Photo</p>
              <p className="text-xs text-slate-400 mt-1">Click to upload a clear image</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
               <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                 <MapPin size={16} className="text-rose-500"/> Location & Contact
               </h3>
               <Input label="Mobile Number" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91..." required />
               <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" required />
               <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" />
            </div>
          </div>

          {/* RIGHT COLUMN: Form Data */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. Basic Details */}
            <Section title="Basic Details" icon={<User size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                
                <div className="grid grid-cols-2 gap-4">
                    <Select 
                      label="Gender" 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      options={['female', 'male']}
                      displayFormat={(opt: string) => opt.charAt(0).toUpperCase() + opt.slice(1)}
                    />
                    
                    {/* UPDATED: Height Dropdown */}
                    <Select 
                      label="Height" 
                      name="height" 
                      value={formData.height} 
                      onChange={handleChange}
                      options={heightOptions}
                      placeholder="Select Height"
                      icon={<Ruler size={16} />}
                    />
                </div>

                <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required icon={<Calendar size={16}/>} />
                
                <Select 
                  label="Marital Status" 
                  name="maritalStatus" 
                  value={formData.maritalStatus} 
                  onChange={handleChange}
                  options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']}
                  icon={<Heart size={16} />}
                />
              </div>
            </Section>

            {/* 2. Religious & Horoscope */}
            <Section title="Religious & Horoscope" icon={<Star size={18} />}>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Select 
                    label="Religion" 
                    name="religion" 
                    value={formData.religion} 
                    onChange={handleChange}
                    options={['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other']}
                  />
                  <Input label="Caste" name="caste" value={formData.caste} onChange={handleChange} placeholder="e.g. Brahmin" />
                  <Input label="Gotra" name="gotra" value={formData.gotra} onChange={handleChange} placeholder="e.g. Bharadwaj" />
                  
                  <Input label="Time of Birth" name="tob" type="time" value={formData.tob} onChange={handleChange} />
                  <Input label="Place of Birth" name="pob" value={formData.pob} onChange={handleChange} />
                  
                  <Select 
                    label="Manglik Status" 
                    name="manglik" 
                    value={formData.manglik} 
                    onChange={handleChange}
                    options={['No', 'Yes', 'Anshik (Partial)', "Don't Know"]}
                  />
               </div>
            </Section>

            {/* 3. Education & Career */}
            <Section title="Education & Career" icon={<Briefcase size={18} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Highest Education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBA, B.Tech" />
                    <Input label="Profession" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" />
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
                    <Input label="Siblings" name="siblings" value={formData.siblings} onChange={handleChange} placeholder="e.g. 1 Brother, 2 Sisters" className="md:col-span-2" />
                </div>
            </Section>
            
            {/* About */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <label className="block text-sm font-bold text-slate-700 mb-2">About Candidate / Notes</label>
               <textarea 
                  name="about" 
                  value={formData.about} 
                  onChange={handleChange} 
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  placeholder="Describe personality, hobbies, and partner expectations..."
               />
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Profile' : 'Save Biodata'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- IMPROVED HELPER COMPONENTS ---

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">{icon}</div> 
            {title}
        </h3>
        {children}
    </div>
);

const Input = ({
  label,
  className,
  icon,
  ...props
}: {
  label: string
  className?: string
  icon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={className}>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{label}</label>
    <div className="relative">
        <input 
          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium"
          {...props}
        />
        {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
    </div>
  </div>
);

// NEW: Beautiful Custom Select Component
const Select = ({
  label,
  options,
  displayFormat,
  icon,
  placeholder,
  ...props
}: {
  label: string
  options: string[]
  displayFormat?: (value: string) => string
  icon?: React.ReactNode
  placeholder?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{label}</label>
    <div className="relative">
      <select 
        className="w-full p-3 pr-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer hover:bg-slate-50"
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {displayFormat ? displayFormat(opt) : opt}
          </option>
        ))}
      </select>
      {/* Custom Chevron Icon */}
      {icon && <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        <ChevronDown size={18} strokeWidth={2.5} />
      </div>
    </div>
  </div>
);

export default ProfileForm;
