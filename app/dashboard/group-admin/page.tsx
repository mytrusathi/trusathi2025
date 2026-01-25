"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import ProfileList from '@/components/group-admin/ProfileList';
import { 
  Share2, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Settings, 
  LayoutDashboard,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function GroupAdminDashboard() {
  const { user } = useAuth(); //
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isSlugFixed = !!user?.slug;

  // Initialize slug from user data
  useEffect(() => {
    if (user?.slug) {
      setSlug(user.slug);
    }
  }, [user]);

  // Determine which identifier to use for the link (Slug preferred, UID fallback)
  const displayIdentifier = slug || user?.slug || user?.uid;
  const communityLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/community/${displayIdentifier}`
    : '';

  const handleSaveSlug = async () => {
    if (!user?.uid || !slug) return;

// Check if the user already has a fixed slug
  if (user?.slug) {
    alert("The community link is permanent and cannot be changed once set to prevent breaking shared links.");
    return;
  }

    setIsSaving(true);
    try {
      // Clean slug: lowercase, replace spaces/special chars with hyphens
      const cleanSlug = slug.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      await updateDoc(doc(db, 'users', user.uid), { 
        slug: cleanSlug 
      });
      alert("Custom URL set! This is now your permanent community link.");
    } catch (error) {
      console.error("Error updating slug:", error);
      alert("Failed to update URL.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (communityLink) {
      navigator.clipboard.writeText(communityLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
  const message = `Check out our verified community matches on TruSathi! 
Find your soulmate within our trusted group here: ${communityLink}`;
  
  // Encodes the message for a URL
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  // Opens WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-rose-600" />
            Admin Control Center
          </h1>
          <p className="text-slate-500 mt-1">
            Managing: <span className="font-semibold text-slate-700">{user?.groupName || 'Trusted Community'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
          <ShieldCheck size={18} /> Verified Group Admin
        </div>
      </div>

      {/* 2. Custom URL Settings Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Settings size={20} className="text-rose-500" /> 
          {isSlugFixed ? "Your Community Link" : "Customize Your Community Link"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              {isSlugFixed ? "Permanent URL" : "Personalized URL Slug"}
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
              <span className="text-slate-400 text-sm hidden sm:inline">trusathi.com/community/</span>
              <input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                readOnly={isSlugFixed}
                placeholder="e.g., sharma-community"
                className="bg-transparent outline-none text-slate-700 font-medium ml-1 flex-1 min-w-0"
              />
            </div>
          </div>
          {!isSlugFixed && (
          <button 
            onClick={handleSaveSlug}
            disabled={isSaving || !slug || !!user?.slug}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {user?.slug ? "URL Fixed" : isSaving ? "Saving..." : "Set Permanent Link"}
          </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-3 ml-1">
          {isSlugFixed
          ? "This link is now permanent to ensure your shared WhatsApp links never break." 
        : "Tip: Once set, this link cannot be changed."}
        </p>
      </div>
      );
          

      {/* 3. WhatsApp Sharing Card */}
      <div className="bg-linear-to-br from-rose-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl shadow-rose-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
              <Share2 size={14} /> Share Community
            </div>
            <h2 className="text-3xl font-extrabold">Ready to grow your group?</h2>
            <p className="text-rose-100 text-lg max-w-md">
              Copy your personalized link and share it on WhatsApp. Members can view profiles verified by you instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
              onClick={copyToClipboard}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                copied ? 'bg-green-500 text-white scale-105' : 'bg-white text-rose-600 hover:bg-rose-50'
              }`}
            >
              {copied ? <CheckCircle2 size={22} /> : <Copy size={22} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          
          <button 
  onClick={shareToWhatsApp}
  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:bg-[#20ba5a] transition-all shadow-lg"
>
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  Share on WhatsApp
</button>

            <a 
              href={`/community/${displayIdentifier}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-rose-800/50 text-white rounded-2xl font-bold text-lg border border-white/30 hover:bg-rose-800/70 transition-all"
            >
              <ExternalLink size={22} /> Preview
            </a>
          </div>
        </div>
      </div>

      {/* 4. Profile Management Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-rose-500" size={22} />
            Manage Community Profiles
          </h3>
          <p className="text-sm text-slate-500">Add or edit the profiles that appear on your community page.</p>
        </div>
        <div className="p-6">
          <ProfileList /> {/* */}
        </div>
      </div>

    </div>
  );
}