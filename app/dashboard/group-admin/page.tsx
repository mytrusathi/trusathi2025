// app/dashboard/group-admin/page.tsx
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

  useEffect(() => {
    if (user?.slug) setSlug(user.slug);
  }, [user?.slug]);

  const isSlugFixed = !!user?.slug;
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
      alert("Custom URL set permanently! Your shared links will never break.");
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
    const message = `Check out our verified community matches on TruSathi! Find your soulmate here: ${communityLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-rose-600" /> Admin Control Center
          </h1>
          <p className="text-slate-500 mt-1">Managing: {user?.groupName || 'Community'}</p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 flex items-center gap-2">
          <ShieldCheck size={18} /> Verified Admin
        </div>
      </div>

      {/* 1. URL Management: Form disappears if slug exists */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Settings size={20} className="text-rose-500" /> {isSlugFixed ? "Your Community Link" : "Set Custom URL"}
        </h2>
        {!isSlugFixed ? (
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Choose a unique name (Permanent)</label>
              <div className="flex items-center bg-slate-50 border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                <span className="text-slate-400 text-sm hidden sm:inline">trusathi.com/community/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="sharma-community" className="bg-transparent outline-none ml-1 flex-1" />
              </div>
            </div>
            <button onClick={handleSaveSlug} disabled={isSaving || !slug} className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
              {isSaving ? "Saving..." : "Set Link"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-6 py-4 border border-slate-200">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Active Profile URL</p>
               <p className="text-lg font-bold text-rose-600">trusathi.com/community/{user?.slug}</p>
            </div>
            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={20}/> Verified & Active</span>
          </div>
        )}
      </div>

      {/* 2. Sharing Card */}
      <div className="bg-linear-to-br from-rose-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to grow your group?</h2>
          <p className="text-rose-100 text-lg">Copy your link or share it directly on WhatsApp.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button onClick={copyToClipboard} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-rose-600'}`}>
            {copied ? <CheckCircle2 size={22} /> : <Copy size={22} />} {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={shareToWhatsApp} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg">
             Share on WhatsApp
          </button>
          <a href={`/community/${displayIdentifier}`} target="_blank" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-rose-800/50 text-white rounded-2xl font-bold text-lg border border-white/30">
            <ExternalLink size={22} /> Preview
          </a>
        </div>
      </div>

      {/* 3. Profile List */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Users className="text-rose-500" size={22} /> Manage Community Profiles
        </h3>
        <ProfileList />
      </div>
    </div>
  );
}