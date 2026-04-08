"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  Settings, User, Shield, CheckCircle2, 
  AlertCircle, Save, Globe, EyeOff, Loader2 
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [groupName, setGroupName] = useState(user?.groupName || '');
  const [isPublic, setIsPublic] = useState(user?.isApproved !== false); // fallback to something
  // Wait, I should add a specific field for account visibility in the plan, I'll use 'isAccountPublic'
  const [isAccountPublic, setIsAccountPublic] = useState(true); 
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        groupName: groupName.trim(),
        // We'll store account visibility preference here
        isAccountPublic: isAccountPublic,
        updatedAt: new Date().toISOString()
      });
      
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      // The AuthContext will pick up changes on next reload or we could manually refresh.
      // Since it's a client component using useAuth, it should ideally update if AuthContext listens to doc changes.
      // But standard Firebase onAuthStateChanged doesn't listen to Firestore doc changes.
    } catch (error) {
      console.error("Update settings error:", error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="text-rose-500" size={32} /> Account Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage your account information and preferences.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
             <User size={20} className="text-slate-400" /> Basic Information
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>

              {user?.role !== 'member' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Community/Group Name</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    placeholder="e.g. Agarwal Samaj"
                  />
                </div>
              )}
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" 
                disabled 
              />
              <p className="text-xs text-slate-400 ml-1 italic">Email cannot be changed directly for security reasons.</p>
           </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
             <Shield size={20} className="text-slate-400" /> Privacy & Visibility
           </h2>

           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-4">
                 <div className={`p-3 rounded-xl ${isAccountPublic ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    {isAccountPublic ? <Globe size={24} /> : <EyeOff size={24} />}
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">{isAccountPublic ? 'Public Account' : 'Hidden Account'}</h3>
                    <p className="text-sm text-slate-500">
                      {isAccountPublic 
                        ? 'Your community page and verified profiles are visible to the public.' 
                        : 'Your community page and profiles are hidden from search and public results.'}
                    </p>
                 </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAccountPublic(!isAccountPublic)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isAccountPublic ? 'bg-rose-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAccountPublic ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
           </div>
        </div>

        <div className="flex justify-end pt-4">
           <button 
             type="submit" 
             disabled={loading}
             className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center gap-3 disabled:opacity-70"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             Save Settings
           </button>
        </div>
      </form>
    </div>
  );
}
