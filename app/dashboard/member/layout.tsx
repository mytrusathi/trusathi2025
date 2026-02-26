// app/dashboard/member/layout.tsx
'use client'

import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import Link from 'next/link'
import { User, LogOut, Search, KeyRound } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
 const { user } = useAuth()
 const searchParams = useSearchParams()
 const activeView = searchParams.get('view')
 const isPasswordView = activeView === 'change-password'

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:fixed md:h-full z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">t</div>
          <span className="font-bold text-xl text-slate-800">tru<span className="text-rose-600">Sathi</span></span>
        </div>
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Logged In As</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName || user?.email || 'Member'}</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard/member"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              !isPasswordView ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={20} />
            My Profile
          </Link>

          <Link
            href="/dashboard/member?view=change-password"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isPasswordView ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <KeyRound size={20} />
            Change Your Password
          </Link>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors cursor-not-allowed">
            <Search size={20} />
            Browse Matches <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-500">Soon</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
