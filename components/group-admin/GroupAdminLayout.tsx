'use client'

import { ReactNode } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function GroupAdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-tr from-rose-500 to-purple-500 p-1.5 rounded-lg">
              <Heart size={16} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Trusathi Partner Console</span>
              <span className="text-[10px] text-slate-400">
                {user?.groupName || 'Group Admin'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 hover:border-rose-500 hover:text-rose-300 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
