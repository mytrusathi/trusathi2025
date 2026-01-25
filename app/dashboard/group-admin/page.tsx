"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ProfileList from '@/components/group-admin/ProfileList';
import { 
  Share2, ExternalLink, Copy, CheckCircle2, Settings, LayoutDashboard, Users, ShieldCheck 
} from 'lucide-react';

export default function GroupAdminDashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Use a constant to track if the slug is already saved in the database
  const isSlugFixed = !!user?.slug;

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

  const handleSaveSlug = async () => {
    if (!user?.uid || !slug || isSlugFixed) return;
    setIsSaving(true);
    try {
      const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await updateDoc(doc(db, 'users', user.uid), { slug: cleanSlug });
      alert("URL set permanently!");
    } catch (error) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard className="text-rose-600" /> Admin Center
        </h1>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 flex items-center gap-2">
          <ShieldCheck size={18} /> Verified Admin
        </div>
      </div>

      {/* URL Management: Hides the input field if a slug already exists */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Settings size={20} className="text-rose-500" /> 
          {isSlugFixed ? "Your Permanent Community Link" : "Customize Your Community Link"}
        </h2>
        
        {!isSlugFixed ? (
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL Slug (Cannot be changed later)</label>
              <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-500/20">
                <span className="text-slate-400 text-sm hidden sm:inline">trusathi.com/community/</span>
                <input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="e.g., sharma-group" 
                  className="bg-transparent outline-none ml-1 flex-1" 
                />
              </div>
            </div>
            <button onClick={handleSaveSlug} disabled={isSaving || !slug} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">
              {isSaving ? "Saving..." : "Set Link"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-6 py-4 border border-slate-200">
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Active URL</p>
                <p className="text-lg font-bold text-rose-600">trusathi.com/community/{user?.slug}</p>
             </div>
             <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                <CheckCircle2 size={20} /> Link Verified & Active
             </div>
          </div>
        )}
      </div>

      {/* Sharing Card */}
      <div className="bg-linear-to-br from-rose-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-extrabold">Ready to share?</h2>
          <p className="text-rose-100">Copy your link or share it on WhatsApp.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button onClick={copyToClipboard} className={`flex-1 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-rose-600'}`}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={shareToWhatsApp} className="flex-1 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg">
             Share on WhatsApp
          </button>
          <a href={`/community/${displayIdentifier}`} target="_blank" className="flex-1 px-8 py-4 bg-rose-800/50 text-white rounded-2xl font-bold text-lg border border-white/30 flex items-center justify-center gap-2">
            <ExternalLink size={22} /> Preview
          </a>
        </div>
      </div>

      {/* Profiles Section */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Users className="text-rose-500" /> Manage Community Profiles
        </h3>
        <ProfileList />
      </div>
    </div>
  );
}