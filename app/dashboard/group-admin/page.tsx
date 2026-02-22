"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ProfileList from '@/components/group-admin/ProfileList';
import { 
  Share2, ExternalLink, Copy, Settings, LayoutDashboard, Users, Check, Globe 
} from 'lucide-react';

export default function GroupAdminDashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.slug) {
      setSlug(user.slug);
    }
  }, [user?.slug]);

  // Priority: Use the saved slug for the link, fallback to UID only if no slug exists
  const displayIdentifier = user?.slug || user?.uid;
  const communityLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/community/${displayIdentifier}` 
    : '';

  const handleUpdateSlug = async () => {
    if (!user?.uid || !slug) return;
    setIsSaving(true);
    try {
      const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await updateDoc(doc(db, 'users', user.uid), { slug: cleanSlug });
      setSlug(cleanSlug);
      setIsEditing(false);
      alert("Community URL updated successfully!");
    } catch (error) {
      console.error("Failed to update URL", error);
      alert("Failed to update URL.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(communityLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = `Check out our verified community matches on TruSathi! ${communityLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-rose-500" /> Admin Center
          </h1>
          <p className="text-slate-500">Manage your community and member profiles</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
          <Check size={16} /> Verified Admin
        </div>
      </div>

      {/* NEW: URL Management Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
          <Globe size={20} className="text-rose-500" /> Community Link
        </h2>
        
        {isEditing ? (
          <div className="flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Customize your handle</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
                <span className="text-slate-400 text-sm hidden sm:inline">trusathi.com/community/</span>
                <input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  className="bg-transparent outline-none ml-1 flex-1 font-semibold text-slate-700"
                  placeholder="your-group-name"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => { setIsEditing(false); setSlug(user?.slug || ''); }} 
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateSlug} 
                disabled={isSaving || !slug}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 rounded-xl px-6 py-5 border border-slate-200 gap-4">
             <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Public Address</p>
                <p className="text-lg font-bold text-rose-600 break-all">
                  trusathi.com/community/{user?.slug || 'loading...'}
                </p>
             </div>
             <button 
               onClick={() => setIsEditing(true)} 
               className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-200 bg-white rounded-lg transition-all shadow-sm"
             >
               <Settings size={16} /> Edit URL
             </button>
          </div>
        )}
      </div>

      {/* Quick Sharing Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-all group"
        >
          {copied ? <Check className="text-green-500" /> : <Copy className="text-slate-400 group-hover:text-rose-500" />}
          <span className="font-bold text-slate-700">{copied ? "Link Copied!" : "Copy Link"}</span>
        </button>

        <button 
          onClick={shareToWhatsApp}
          className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-green-200 hover:bg-green-50 transition-all group"
        >
          <Share2 className="text-slate-400 group-hover:text-green-500" />
          <span className="font-bold text-slate-700">WhatsApp Share</span>
        </button>

        <a 
          href={communityLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-all group"
        >
          <ExternalLink className="text-slate-400 group-hover:text-blue-500" />
          <span className="font-bold text-slate-700">Preview Page</span>
        </a>
      </div>

      <hr className="border-slate-100" />

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="text-rose-500" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Community Members</h2>
        </div>
        <ProfileList />
      </div>
    </div>
  );
}