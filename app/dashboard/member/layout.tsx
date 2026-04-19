"use client";
import React, { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LogOut, Settings, KeyRound, LayoutDashboard, UserCircle } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/dashboard/NotificationBell';
import Logo from '@/components/Logo';
import PageLoader from '@/components/PageLoader';

interface Props {
  children: React.ReactNode;
}

const MemberLayoutContent = ({ children }: Props) => {
  const { user } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <DashboardSidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Universal TopBar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="md:hidden">
                <Logo size="md" />
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-slate-400 font-medium text-sm">
               <UserCircle size={18} />
               <span>Welcome, <span className="text-slate-900 font-bold">{user?.displayName || 'Member'}</span></span>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="relative group/profile">
                    <div className="w-9 h-9 rounded-full border border-slate-200 p-0.5 group-hover/profile:border-rose-400 transition-all overflow-hidden bg-white shadow-sm flex items-center justify-center cursor-pointer">
                       <div className="w-full h-full rounded-full flex items-center justify-center bg-rose-50 text-rose-500 text-xs font-black uppercase">
                          {user?.displayName?.charAt(0) || 'U'}
                       </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full pt-4 w-64 opacity-0 translate-y-3 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-500 z-[100]">
                      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden py-3">
                        <div className="px-6 py-4 border-b border-slate-50 mb-2">
                          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Identity Profile</p>
                          <p className="text-sm font-black text-slate-900 truncate">{user?.displayName || user?.email}</p>
                        </div>

                        <DropdownLink href="/dashboard/member" icon={<LayoutDashboard size={16} />}>
                          Dashboard Home
                        </DropdownLink>

                        <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                          Account Settings
                        </DropdownLink>

                        <DropdownLink href="/dashboard/member?view=change-password" icon={<KeyRound size={16} />}>
                           Change Password
                        </DropdownLink>
                      </div>
                    </div>
                </div>

                <div className="w-px h-6 bg-slate-100"></div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </header>

        {/* Content Area */}
        <div className="grow">
          {children}
        </div>
      </main>
    </div>
  );
};

const MemberLayout = ({ children }: Props) => {
  return (
    <ProtectedRoute allowedRoles={['member', 'group-admin', 'super-admin']}>
      <Suspense fallback={<PageLoader message="Initializing Dashboard..." />}>
        <MemberLayoutContent>{children}</MemberLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
};

export default MemberLayout;

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-6 py-3.5 hover:bg-rose-50 text-sm font-bold text-slate-700 transition-all text-left hover:pl-8 group">
      <span className="text-slate-400 group-hover:text-rose-500 transition-colors">{icon}</span>
      {children}
    </Link>
  );
}
