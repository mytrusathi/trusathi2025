"use client";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { 
  LogOut, LayoutDashboard, Users, Settings, 
  KeyRound, Globe, User, Search, Home,
  Heart, Send, Inbox, MessageCircle, SlidersHorizontal, Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarLink {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
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

  // Role-specific primary links
  if (isRole('group-admin') || isRole('super-admin')) {
    links.push(
      { 
        href: '/dashboard/group-admin', 
        icon: LayoutDashboard, 
        label: 'Managed Profiles', 
        active: pathname === '/dashboard/group-admin' && !activeView 
      },
      { 
        href: '/dashboard/group-admin?view=community-link', 
        icon: Globe, 
        label: 'Community Link', 
        active: activeView === 'community-link' 
      },
      { 
        href: '/dashboard/group-admin?view=sent-interests', 
        icon: Send, 
        label: 'Sent Interests', 
        active: activeView === 'sent-interests' 
      },
      { 
        href: '/dashboard/group-admin?view=received-interests', 
        icon: Inbox, 
        label: 'Received Interests', 
        active: activeView === 'received-interests' 
      },
      { 
        href: '/dashboard/group-admin?view=chats', 
        icon: MessageCircle, 
        label: 'Messages', 
        active: activeView === 'chats' 
      },
      { 
        href: '/dashboard/group-admin?view=notifications', 
        icon: Bell, 
        label: 'Notifications', 
        active: activeView === 'notifications' 
      }
    );
  } else if (isRole('member')) {
    links.push(
      { 
        href: '/dashboard/member', 
        icon: LayoutDashboard, 
        label: 'Overview', 
        active: pathname === '/dashboard/member' && !activeView 
      },
      { 
        href: '/dashboard/member?view=my-profiles', 
        icon: User, 
        label: 'My Profiles', 
        active: activeView === 'my-profiles' 
      },
      { 
        href: '/dashboard/member?view=favorites', 
        icon: Heart, 
        label: 'Favorites', 
        active: activeView === 'favorites' 
      },
      { 
        href: '/dashboard/member?view=sent-interests', 
        icon: Send, 
        label: 'Sent Interests', 
        active: activeView === 'sent-interests' 
      },
      { 
        href: '/dashboard/member?view=received-interests', 
        icon: Inbox, 
        label: 'Received Interests', 
        active: activeView === 'received-interests' 
      },
      { 
        href: '/dashboard/member?view=chats', 
        icon: MessageCircle, 
        label: 'Messages', 
        active: activeView === 'chats' 
      },
      { 
        href: '/dashboard/member?view=partner-preferences', 
        icon: SlidersHorizontal, 
        label: 'Partner Preferences', 
        active: activeView === 'partner-preferences' 
      }
    );
  }

  // Common Links
  links.push(
    { 
      href: '/dashboard/settings', 
      icon: Settings, 
      label: 'Settings', 
      active: pathname === '/dashboard/settings' 
    }
  );

  // Team option ONLY for admins
  if (isRole('group-admin') || isRole('super-admin')) {
    links.push({ 
      href: '/dashboard/team', 
      icon: Users, 
      label: 'Admin Team', 
      active: pathname === '/dashboard/team' 
    });
  }

  links.push({ 
    href: `${pathname}?view=change-password`, 
    icon: KeyRound, 
    label: 'Change Password', 
    active: activeView === 'change-password' 
  });

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:fixed md:h-full z-10 flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">t</div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">truSathi</span>
        </Link>
      </div>

      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">User Identity</p>
        <p className="text-sm font-bold text-slate-800 truncate">{user?.displayName || 'Active Member'}</p>
        <div className="flex items-center gap-1.5 mt-1">
           <div className={`w-1.5 h-1.5 rounded-full ${user?.role === 'member' ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'User'}</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              link.active 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <link.icon size={18} className={link.active ? 'text-indigo-400' : ''} />
            {link.label}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-50">
           <Link 
             href="/search"
             className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl font-bold text-sm transition-all"
           >
             <Search size={18} />
             Browse New Matches
           </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
         >
           <LogOut size={18} />
           Sign Out
         </button>
      </div>
    </aside>
  );
}
