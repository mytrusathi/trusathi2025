"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from 'app/lib/firebase';
import { LogOut, LayoutDashboard, Users, Settings } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const GroupAdminLayout = ({ children }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
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
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/group-admin" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            My Profiles
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

        {/* Content Area */}
        {children}
      </main>
    </div>
  );
};

export default GroupAdminLayout;