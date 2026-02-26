"use client";
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileList from '@/components/group-admin/ProfileList';
import { useSearchParams } from 'next/navigation';
import { 
  Share2, ExternalLink, Copy, LayoutDashboard, Users, Check
} from 'lucide-react';
import PasswordChangeModal from '@/components/PasswordChangeModal';
import CommunityLinkModal from '@/components/CommunityLinkModal';

function GroupAdminDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const showPasswordModal = searchParams.get('view') === 'change-password';
  const showCommunityLinkModal = searchParams.get('view') === 'community-link';
  const [copied, setCopied] = useState(false);

  // Priority: Use the saved slug for the link, fallback to UID only if no slug exists
  const displayIdentifier = user?.slug || user?.uid;
  const communityLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/community/${displayIdentifier}` 
    : '';

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
          <p className="text-slate-500">
            {user?.displayName || user?.email || 'Admin'} {user?.groupName ? `| ${user.groupName}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
          <Check size={16} /> Verified Admin
        </div>
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

      {showPasswordModal && <PasswordChangeModal closeHref="/dashboard/group-admin" />}
      {showCommunityLinkModal && <CommunityLinkModal closeHref="/dashboard/group-admin" />}
    </div>
  );
}

export default function GroupAdminDashboard() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8" />}>
      <GroupAdminDashboardContent />
    </Suspense>
  );
}
