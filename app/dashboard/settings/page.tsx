"use client";
import { 
  Settings, User, Shield, CheckCircle2, 
  AlertCircle, Save, Globe, EyeOff, Loader2, Trash2, TriangleAlert, X,
  LogOut
} from 'lucide-react';
import { deleteUserAccount } from '@/app/lib/account-service';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [groupName, setGroupName] = useState(user?.groupName || '');
  const [isPublic, setIsPublic] = useState(user?.isApproved !== false); 
  const [isAccountPublic, setIsAccountPublic] = useState(true); 
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    // ... same logic as before ...
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        groupName: groupName.trim(),
        isAccountPublic: isAccountPublic,
        updatedAt: new Date().toISOString()
      });
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error("Update settings error:", error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteUserAccount();
      // On success, redirect to login or home
      router.push('/login?deleted=true');
    } catch (err: any) {
      console.error("Deletion error:", err);
      if (err.message === "REAUTH_REQUIRED") {
        alert("For security reasons, please sign out and sign back in again before deleting your account.");
        await signOut(auth);
        window.location.href = '/login';
      } else {
        alert("Failed to delete account. Please contact support.");
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
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
             className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-3 disabled:opacity-70"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             Save Settings
           </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="pt-8 border-t border-slate-200">
         <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-rose-900 flex items-center gap-3">
                    <TriangleAlert className="text-rose-500" /> Danger Zone
                  </h2>
                  <p className="text-rose-700/70 font-medium">
                    Permanently delete your account and all associated data. This action is irreversible.
                  </p>
               </div>
               <button 
                 onClick={() => setShowDeleteConfirm(true)}
                 className="bg-white border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-2xl font-black hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm"
               >
                 Delete My Account
               </button>
            </div>
         </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !deleteLoading && setShowDeleteConfirm(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={deleteLoading}
            >
               <X size={24} />
            </button>

            {deleteStep === 1 ? (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto">
                   <Trash2 size={40} />
                </div>
                <div className="text-center space-y-3">
                   <h3 className="text-3xl font-black text-slate-900">Are you absolutely sure?</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">
                     This will permanently delete your profile, all photos, interests, messages, and account information. 
                     <b> This action cannot be undone.</b>
                   </p>
                </div>
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => setDeleteStep(2)}
                     className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
                   >
                     Yes, I understand the risks
                   </button>
                   <button 
                     onClick={() => setShowDeleteConfirm(false)}
                     className="w-full bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all"
                   >
                     Cancel
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
                   <TriangleAlert size={40} />
                </div>
                <div className="text-center space-y-3">
                   <h3 className="text-3xl font-black text-slate-900">Final Confirmation</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">
                     To confirm, please click the button below. You will be immediately signed out and all your data will be wiped from our systems.
                   </p>
                </div>
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={handleDeleteAccount}
                     disabled={deleteLoading}
                     className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 flex items-center justify-center gap-3"
                   >
                     {deleteLoading ? <Loader2 className="animate-spin" /> : "Permanently Delete Everything"}
                   </button>
                   <button 
                     onClick={() => setDeleteStep(1)}
                     disabled={deleteLoading}
                     className="w-full bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all"
                   >
                     Go Back
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

