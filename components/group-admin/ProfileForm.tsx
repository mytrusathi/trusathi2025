"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../../app/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { parseWhatsAppBiodataToProfile } from '../../app/utils/profileParser';
import { 
  Loader2, Upload, X, Save, User, MapPin, Briefcase, 
  Users, Star, ChevronDown, Ruler, Heart, Calendar, Wand2, Shield, Camera
} from 'lucide-react';
import { Section, Input, Select } from '../ui/FormElements';

interface Props {
  initialData?: Profile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProfileForm = ({ initialData, onSuccess, onCancel }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [rawBiodata, setRawBiodata] = useState('');
  const [parserMessage, setParserMessage] = useState('');
  const [matchedFields, setMatchedFields] = useState<string[]>([]);

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
    occupationCategory: 'Private',
    privacyLevel: 'Public',
    heightValue: 0,
    selfieUrl: '',
    phoneVerified: false,
    adminApproved: false,
  });

  const heightToCm = (h: string) => {
    if(!h) return 0;
    const match = h.match(/(\d+)ft (\d+)in/);
    if(match) {
        const ft = parseInt(match[1]);
        const inch = parseInt(match[2]);
        return Math.round((ft * 30.48) + (inch * 2.54));
    }
    return 0;
  };

  // --- HEIGHT GENERATOR ---
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
      setSelfiePreviewUrl(initialData.selfieUrl || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WEBP).');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB.');
        e.target.value = '';
        return;
      }

      try {
         const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
         const compressedFile = await imageCompression(file, options);
         setImageFile(compressedFile);
         setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
         console.error("Compression failed, using original", error);
         setImageFile(file);
         setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSelfieChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
         const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
         const compressedFile = await imageCompression(file, options);
         setSelfieFile(compressedFile);
         setSelfiePreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
         setSelfieFile(file);
         setSelfiePreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const heightValue = heightToCm(formData.height || '');
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      let selfieUrl = formData.selfieUrl;
      if (selfieFile) {
        const selfieRef = ref(storage, `selfies/${user.uid}/${Date.now()}_${selfieFile.name}`);
        const snapshot = await uploadBytes(selfieRef, selfieFile);
        selfieUrl = await getDownloadURL(snapshot.ref);
      }

      const profileData = {
        ...formData,
        imageUrl,
        selfieUrl,
        createdBy: user.uid,
        nameLowerCase: formData.name?.toLowerCase(), 
        isPublic: formData.isPublic ?? true,
        heightValue: heightValue,
      };

      if (initialData?.id) {
        await updateDoc(doc(db, 'profiles', initialData.id), {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const profileNo = `TS-${randomStr}`;

        await addDoc(collection(db, 'profiles'), {
          ...profileData,
          profileNo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

  const handleParseBiodata = () => {
    if (!rawBiodata.trim()) {
      setParserMessage('Paste biodata text first.');
      setMatchedFields([]);
      return;
    }

    const { parsed, matchedFields: detectedFields } = parseWhatsAppBiodataToProfile(rawBiodata);
    const entries = Object.entries(parsed).filter(([, value]) => typeof value === 'string' && value.trim()) as Array<[keyof Profile, string]>;

    if (entries.length === 0) {
      setParserMessage('No usable fields were detected. Try pasting a longer biodata message.');
      setMatchedFields([]);
      return;
    }

    setFormData((prev) => {
      const next = { ...prev };
      for (const [key, value] of entries) {
        (next as Record<string, unknown>)[String(key)] = value;
      }
      return next;
    });

    setMatchedFields(detectedFields.map((field) => String(field)));
    setParserMessage(`Parsed and filled ${entries.length} field${entries.length > 1 ? 's' : ''}.`);
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4">
                <div className="relative w-48 h-48 rounded-2xl bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {selfiePreviewUrl ? (
                    <Image src={selfiePreviewUrl} alt="Selfie Preview" fill sizes="192px" className="object-cover" unoptimized />
                    ) : (
                    <Camera className="text-slate-300" size={80} />
                    )}
                </div>
                <div className="absolute bottom-2 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                   <Shield size={20} />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <p className="text-sm font-bold text-slate-700">Authenticity Selfie</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">Click to take/upload a live selfie for verification.</p>
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <Wand2 size={18} />
                    </div>
                    WhatsApp Biodata Parser
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Paste raw biodata text and auto-fill this form.
                  </p>
                </div>
              </div>

              <textarea
                value={rawBiodata}
                onChange={(e) => setRawBiodata(e.target.value)}
                rows={6}
                placeholder="Paste WhatsApp biodata message here..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleParseBiodata}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                >
                  Parse & Fill
                </button>
                <button
                  type="button"
                  onClick={() => { setRawBiodata(''); setParserMessage(''); setMatchedFields([]); }}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Clear Text
                </button>
                {parserMessage && (
                  <p className="text-sm text-slate-600">{parserMessage}</p>
                )}
              </div>

              {matchedFields.length > 0 && (
                <p className="text-xs text-slate-500 mt-3">
                  Detected fields: {matchedFields.join(', ')}
                </p>
              )}
            </div>
            
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
                    <Select 
                      label="Occupation Category" 
                      name="occupationCategory" 
                      value={formData.occupationCategory} 
                      onChange={handleChange}
                      options={['Govt', 'Private', 'Business', 'Professional', 'Self-Employed', 'Other']}
                    />
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

            {/* Visibility & Connect Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
               <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Shield size={16} className="text-indigo-500" /> Visibility & Connect Settings
               </h3>
               
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                     <p className="text-sm font-bold text-slate-800">Auto-reveal Contact Details</p>
                     <p className="text-xs text-slate-500">When enabled, verified members will see phone/WhatsApp immediately after sending interest.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, revealContactOnInterest: !prev.revealContactOnInterest }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.revealContactOnInterest ? 'bg-rose-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.revealContactOnInterest ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>
               
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                     <p className="text-sm font-bold text-slate-800">Public Visibility</p>
                     <p className="text-xs text-slate-500">Show this profile in browse & search results.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPublic !== false ? 'bg-rose-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublic !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>

               <div className="space-y-2 mt-2">
                  <Select 
                    label="Privacy Level" 
                    name="privacyLevel" 
                    value={formData.privacyLevel} 
                    onChange={handleChange}
                    options={['Public', 'MembersOnly', 'Private']}
                    displayFormat={(v: string) => v === 'Public' ? 'Public (All)' : v === 'MembersOnly' ? 'Members Only' : 'Private (Explicit Permission)'}
                  />
               </div>
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

export default ProfileForm;
