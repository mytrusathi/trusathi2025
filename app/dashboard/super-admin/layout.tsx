"use client";
import React, { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Logo from '@/components/Logo';
import PageLoader from '@/components/PageLoader';
import NotificationBell from '@/components/dashboard/NotificationBell';
import { UserCircle, LogOut, Settings, KeyRound, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const SuperAdminLayoutContent = ({ children }: Props) => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden">
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto">
        {/* Universal TopBar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="md:hidden">
                <Logo size="md" />
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-slate-400 font-medium text-sm">
               <UserCircle size={18} />
               <span>Authenticated as <span className="text-primary font-black uppercase tracking-tighter">{user?.displayName || 'Super Admin'}</span></span>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="relative group/profile">
                    <div className="w-10 h-10 rounded-full border border-slate-200 p-0.5 group-hover/profile:border-primary transition-all overflow-hidden bg-white shadow-lift flex items-center justify-center cursor-pointer">
                       <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-primary text-xs font-black uppercase">
                          {user?.displayName?.charAt(0) || 'S'}
                       </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full pt-4 w-64 opacity-0 translate-y-3 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-500 z-[100]">
                      <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden py-3">
                        <div className="px-6 py-5 border-b border-slate-50 mb-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Administrative Privilege</p>
                          <p className="text-sm font-black text-slate-900 truncate">{user?.displayName || user?.email}</p>
                        </div>

                        <DropdownLink href="/dashboard/super-admin" icon={<LayoutDashboard size={16} />}>
                          Master Console
                        </DropdownLink>

                        <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                          System Settings
                        </DropdownLink>

                        <DropdownLink href="/dashboard/group-admin?view=change-password" icon={<KeyRound size={16} />}>
                           Security Policy
                        </DropdownLink>
                      </div>
                    </div>
                </div>
                
                <div className="w-px h-6 bg-slate-100"></div>
                <button 
                  onClick={handleLogout} 
                  className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-2 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">Terminate</span>
                </button>
            </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 w-full flex flex-col items-center py-8">
           <div className="w-full max-w-[1400px] px-4 md:px-8">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
};

const SuperAdminLayout = ({ children }: Props) => {
  return (
    <ProtectedRoute requireSuperAdmin>
      <Suspense fallback={<PageLoader message="Initializing Master Console..." />}>
        <SuperAdminLayoutContent>{children}</SuperAdminLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
};

export default SuperAdminLayout;

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 text-xs font-black uppercase tracking-widest text-slate-700 transition-all text-left hover:pl-8 group">
      <span className="text-slate-400 group-hover:text-primary transition-colors">{icon}</span>
      {children}
    </Link>
  );
}
