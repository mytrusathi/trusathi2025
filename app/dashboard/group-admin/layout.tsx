"use client";
import React, { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Logo from '@/components/Logo';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

interface Props {
  children: React.ReactNode;
}

const GroupAdminLayoutContent = ({ children }: Props) => {
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
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
            <Logo size="md" />
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                <LogOut size={24} />
            </button>
        </div>

        {/* Content Area */}
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

const GroupAdminLayout = ({ children }: Props) => {
  return (
    <ProtectedRoute requireAdmin>
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <GroupAdminLayoutContent>{children}</GroupAdminLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
};

export default GroupAdminLayout;
