"use client";
import React, { Suspense } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from 'app/lib/firebase';
import { LogOut, LayoutDashboard, Users, Settings, KeyRound, Globe } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const GroupAdminLayoutContent = ({ children }: Props) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view');
  const isPasswordView = activeView === 'change-password';
  const isCommunityLinkView = activeView === 'community-link';
  const isDashboardView = !isPasswordView && !isCommunityLinkView;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Force a full page reload to clear browser memory/cache
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">t</div>
            <span className="font-bold text-xl text-slate-800">tru<span className="text-rose-600">Sathi</span></span>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Logged In As</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName || user?.email || 'Group Admin'}</p>
          <p className="text-xs text-rose-600 font-medium truncate">{user?.groupName || 'No Group Name Set'}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard/group-admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isDashboardView ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} />
            My Profiles
          </Link>
          <Link
            href="/dashboard/group-admin?view=community-link"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isCommunityLinkView ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe size={20} />
            Community Link
          </Link>
          <Link
            href="/dashboard/group-admin?view=change-password"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isPasswordView ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <KeyRound size={20} />
            Change Your Password
          </Link>
          <div className="px-4 py-3 text-slate-400 flex items-center gap-3 cursor-not-allowed">
            <Users size={20} />
            <span className="text-slate-400">Team (Coming Soon)</span>
          </div>
          <div className="px-4 py-3 text-slate-400 flex items-center gap-3 cursor-not-allowed">
            <Settings size={20} />
            <span className="text-slate-400">Settings</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
           >
             <LogOut size={20} />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold">t</div>
                <span className="font-bold text-lg text-slate-800">truSathi Admin</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                <LogOut size={24} />
            </button>
        </div>
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500">{user?.displayName || user?.email || 'Group Admin'}</p>
          <p className="text-sm font-semibold text-rose-600">{user?.groupName || 'No Group Name Set'}</p>
          <div className="mt-3 flex items-center gap-2">
            <Link href="/dashboard/group-admin" className={`px-3 py-1.5 text-xs rounded-full font-semibold ${isDashboardView ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
              Profiles
            </Link>
            <Link href="/dashboard/group-admin?view=community-link" className={`px-3 py-1.5 text-xs rounded-full font-semibold ${isCommunityLinkView ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
              Community Link
            </Link>
            <Link href="/dashboard/group-admin?view=change-password" className={`px-3 py-1.5 text-xs rounded-full font-semibold ${isPasswordView ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
              Password
            </Link>
          </div>
        </div>

        {/* Content Area */}
        {children}
      </main>
    </div>
  );
};

const GroupAdminLayout = ({ children }: Props) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <GroupAdminLayoutContent>{children}</GroupAdminLayoutContent>
    </Suspense>
  );
};

export default GroupAdminLayout;
