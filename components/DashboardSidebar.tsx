"use client";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { 
  LogOut, LayoutDashboard, Users, Settings, 
  KeyRound, Globe, User, Search, Home 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarLink {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
  comingSoon?: boolean;
}

export default function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isRole = (role: string) => user?.role === role;

  const links: SidebarLink[] = [];

  if (isRole('group-admin') || isRole('super-admin')) {
    links.push(
      { 
        href: '/dashboard/group-admin', 
        icon: LayoutDashboard, 
        label: 'My Profiles', 
        active: pathname === '/dashboard/group-admin' && !activeView 
      },
      { 
        href: '/dashboard/group-admin?view=community-link', 
        icon: Globe, 
        label: 'Community Link', 
        active: activeView === 'community-link' 
      }
    );
  } else {
    links.push({ 
      href: '/dashboard/member', 
      icon: User, 
      label: 'My Profile', 
      active: pathname === '/dashboard/member' && !activeView 
    });
  }

  // Common Links
  links.push(
    { 
      href: '/dashboard/settings', 
      icon: Settings, 
      label: 'Settings', 
      active: pathname === '/dashboard/settings' 
    },
    { 
      href: '/dashboard/team', 
      icon: Users, 
      label: 'Team', 
      active: pathname === '/dashboard/team' 
    },
    { 
      href: `${pathname}?view=change-password`, 
      icon: KeyRound, 
      label: 'Change Password', 
      active: activeView === 'change-password' 
    }
  );

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:fixed md:h-full z-10 flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">t</div>
          <span className="font-bold text-xl text-slate-800">tru<span className="text-rose-600">Sathi</span></span>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Logged In As</p>
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName || user?.email || 'User'}</p>
        {user?.role !== 'member' && (
          <p className="text-xs text-rose-600 font-medium truncate">{user?.groupName || 'No Group Set'}</p>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              link.active 
                ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-100/50' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-rose-600'
            }`}
          >
            <link.icon size={20} className={link.active ? 'text-rose-600' : ''} />
            {link.label}
          </Link>
        ))}

        <Link 
          href="/search"
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl font-medium transition-all"
        >
          <Search size={20} />
          Browse Matches
        </Link>
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
  );
}
