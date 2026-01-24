"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileList from '@/components/group-admin/ProfileList';
import { 
  Share2, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Users, 
  LayoutDashboard 
} from 'lucide-react';

export default function GroupAdminDashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Construct the unique community link using the admin's UID
  const communityLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/community/${user?.uid}`
    : '';

  const handleCopyLink = () => {
    if (communityLink) {
      navigator.clipboard.writeText(communityLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Welcome & Branding Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <LayoutDashboard className="text-rose-600" />
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Managing community: <span className="font-semibold text-slate-700">{user?.groupName || 'My Community'}</span>
        </p>
      </div>

      {/* 2. Personalized Community Sharing Card */}
      <div className="bg-linear-to-br from-rose-600 to-rose-700 rounded-2xl p-6 md:p-8 text-white mb-10 shadow-xl shadow-rose-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <Share2 size={14} /> New Feature: White-Label Page
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Your Community Page is Live</h2>
            <p className="text-rose-100 max-w-md">
              Share your personalized TruSathi link in your WhatsApp groups. Members will see profiles verified specifically by you.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm truncate max-w-62.5 sm:max-w-none">
              <span className="text-sm font-mono text-rose-50 opacity-80 truncate">
                {communityLink}
              </span>
            </div>
            
            <button 
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-white text-rose-600 hover:bg-rose-50'
              }`}
            >
              {copied ? (
                <><CheckCircle2 size={18} /> Copied!</>
              ) : (
                <><Copy size={18} /> Copy Link</>
              )}
            </button>

            <a 
              href={`/community/${user?.uid}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-800/40 hover:bg-rose-800/60 text-white border border-white/20 rounded-xl font-bold transition-all"
            >
              <ExternalLink size={18} /> Preview
            </a>
          </div>
        </div>
      </div>

      {/* 3. Stats Overview (Optional UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Verified Profiles</p>
            <Users className="text-rose-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">Active</p>
        </div>
        {/* Add more stat cards here if needed */}
      </div>

      {/* 4. The Profile List Management Component */}
      <div className="bg-white rounded-3xl p-2 md:p-6 border border-slate-100 shadow-sm">
        <div className="mb-6 px-4 pt-4">
          <h3 className="text-xl font-bold text-slate-800">Manage Profiles</h3>
          <p className="text-sm text-slate-500">Add, edit, or remove profiles from your community page</p>
        </div>
        <ProfileList />
      </div>
    </div>
  );
}