import React, { useState, useEffect } from 'react';
import { db, storage } from '../../app/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../types/profile';
import { Loader2, Upload, X, Save, ArrowLeft } from 'lucide-react';

interface Props {
  initialData?: Profile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProfileForm = ({ initialData, onSuccess, onCancel }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    education: '',
    profession: '',
    income: '',
    location: '',
    religion: 'Hindu',
    caste: '',
    fatherName: '',
    fatherOccupation: '',
    contact: '',
    about: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto my-8">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? 'Edit Profile' : 'Create New Profile'}
        </h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column - Image & Basic Info */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative mb-3 group cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-slate-400" size={32} />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold">Change Photo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Tap to upload profile photo</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Basic Details</h3>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                   <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none">
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                   </select>
                </div>
              </div>
              <Input label="Height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 5'10&quot;" />
              <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
            </div>
          </div>

          {/* Right Column - Professional & Family */}
          <div className="space-y-6">
             <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Professional & Social</h3>
              <Input label="Education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBA, B.Tech" />
              <Input label="Profession" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" />
              <Input label="Annual Income" name="income" value={formData.income} onChange={handleChange} placeholder="e.g. 10-12 LPA" />
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                 <Input label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Family & Contact</h3>
              <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              <Input label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
              <Input label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Profile' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper Input Component
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input 
      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
      {...props}
    />
  </div>
);

export default ProfileForm;