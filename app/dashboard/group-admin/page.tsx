"use client";
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileList from '@/components/group-admin/ProfileList';
import { useSearchParams } from 'next/navigation';
import { 
  Share2, ExternalLink, Copy, LayoutDashboard, Users, Check, Home, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import PasswordChangeModal from '@/components/PasswordChangeModal';
import CommunityLinkModal from '@/components/CommunityLinkModal';
import InterestsView from '@/components/dashboard/InterestsView';
import ChatView from '@/components/dashboard/ChatView';
import NotificationsView from '@/components/dashboard/NotificationsView';

function GroupAdminDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  
  const showPasswordModal = view === 'change-password';
  const showCommunityLinkModal = view === 'community-link';
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

  const renderView = () => {
    switch (view) {
      case 'sent-interests':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-2">
                <LayoutDashboard className="text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">Sent Interests</h2>
             </div>
             <InterestsView type="sent" />
          </div>
        );
      case 'received-interests':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-2">
                <LayoutDashboard className="text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">Received Interests</h2>
             </div>
             <InterestsView type="received" />
          </div>
        );
      case 'chats':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-2">
                <LayoutDashboard className="text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">Active Messages</h2>
             </div>
             <ChatView />
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <NotificationsView />
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-xs uppercase tracking-widest mb-2 transition-colors group"
          >
            <Home size={13} className="group-hover:-translate-y-0.5 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-rose-500" /> Admin Center
          </h1>
          <p className="text-slate-500 text-sm">
            {user?.displayName || user?.email || 'Admin'} {user?.groupName ? `| ${user.groupName}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
          <Check size={16} /> Verified Admin
        </div>
      </div>

      {renderView()}

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
