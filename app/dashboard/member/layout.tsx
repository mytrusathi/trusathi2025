"use client";
import React, { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

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
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <MemberLayoutContent>{children}</MemberLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
};

export default MemberLayout;
