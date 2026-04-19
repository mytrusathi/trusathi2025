"use client";
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileList from '@/components/group-admin/ProfileList';
import { useSearchParams } from 'next/navigation';
import { 
  Share2, ExternalLink, Copy, LayoutDashboard, Users, Check, Home
} from 'lucide-react';
import Link from 'next/link';
import PasswordChangeModal from '@/components/PasswordChangeModal';
import CommunityLinkModal from '@/components/CommunityLinkModal';
import InterestsView from '@/components/dashboard/InterestsView';
import ChatView from '@/components/dashboard/ChatView';
import NotificationsView from '@/components/dashboard/NotificationsView';
import { AlertCircle, PartyPopper, ShieldAlert } from 'lucide-react';

function GroupAdminDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const isNewlyRegistered = searchParams.get('registered') === 'success';
  const showPasswordModal = view === 'change-password';
  const showCommunityLinkModal = view === 'community-link';
  const [copied, setCopied] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(isNewlyRegistered);

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
      {/* Registration Success Alert */}
      {showWelcomeAlert && (
        <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center justify-between gap-6 animate-in slide-in-from-top-10 duration-700 animate-out fade-out fill-mode-forwards relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <PartyPopper size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Registration Successful!</h3>
              <p className="text-emerald-50/90 text-sm font-medium">Welcome to TruSathi. Your community dashboard is ready.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowWelcomeAlert(false)}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Approval Pending Banner */}
      {user?.isApproved === false && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900">Verification Pending</h3>
              <p className="text-amber-700 text-sm font-medium leading-relaxed">
                Your account is currently being reviewed by our team. <br className="hidden md:block" />
                You can browse the dashboard, but <span className="font-bold underline">profile creation</span> is restricted until verified.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-black uppercase tracking-widest">
            <AlertCircle size={14} /> Processing Review
          </div>
        </div>
      )}

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
        
        {user?.isApproved !== false ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
            <Check size={16} /> Verified Admin
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-sm font-bold border border-slate-100 italic">
            <AlertCircle size={16} /> Verification Pending
          </div>
        )}
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
