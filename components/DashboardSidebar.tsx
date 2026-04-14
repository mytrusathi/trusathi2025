"use client";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { type LucideIcon } from 'lucide-react';
import { 
  LogOut, LayoutDashboard, Users, Settings, 
  KeyRound, Globe, User, Search, Home,
  Heart, Send, Inbox, MessageCircle, SlidersHorizontal, Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Logo from './Logo';

interface SidebarLink {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  view?: string;
  count?: number;
}

export default function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view');

  const [counts, setCounts] = React.useState({
    sent: 0,
    received: 0,
    connects: 0,
    connects_from_sent: 0,
    connects_from_received: 0,
    favs: 0,
    notifications: 0
  });

  React.useEffect(() => {
    if (!user) return;

    // Listeners for counts
    const qSent = query(collection(db, 'interests'), where('senderId', '==', user.uid));
    const qReceived = query(collection(db, 'interests'), where('receiverId', '==', user.uid));
    const qFavs = query(collection(db, 'favorites'), where('userId', '==', user.uid));
    const qNotifs = query(collection(db, 'notifications'), where('recipientId', '==', user.uid), where('isRead', '==', false));

    const unsubSent = onSnapshot(qSent, (snap) => {
      const docs = snap.docs.map(d => d.data());
      setCounts(prev => ({ 
        ...prev, 
        sent: docs.filter(d => d.status !== 'accepted').length,
        connects: docs.filter(d => d.status === 'accepted').length + prev.connects - (prev.connects_from_sent || 0),
        connects_from_sent: docs.filter(d => d.status === 'accepted').length
      } as any));
    });

    const unsubReceived = onSnapshot(qReceived, (snap) => {
      const docs = snap.docs.map(d => d.data());
      setCounts(prev => ({ 
        ...prev, 
        received: docs.filter(d => d.status !== 'accepted').length,
        connects: docs.filter(d => d.status === 'accepted').length + prev.connects - (prev.connects_from_received || 0),
        connects_from_received: docs.filter(d => d.status === 'accepted').length
      } as any));
    });

    const unsubFavs = onSnapshot(qFavs, (snap) => {
      setCounts(prev => ({ ...prev, favs: snap.size }));
    });

    const unsubNotifs = onSnapshot(qNotifs, (snap) => {
      setCounts(prev => ({ ...prev, notifications: snap.size }));
    });

    return () => {
      unsubSent();
      unsubReceived();
      unsubFavs();
      unsubNotifs();
    };
  }, [user]);

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
        href: '/dashboard/member?view=connects', 
        icon: Users, 
        label: 'Your Connects', 
        count: counts.connects,
        active: activeView === 'connects' 
      },
      { 
        href: '/dashboard/member?view=favorites', 
        icon: Heart, 
        label: 'Shortlisted', 
        count: counts.favs,
        active: activeView === 'favorites' 
      },
      { 
        href: '/dashboard/member?view=sent-interests', 
        icon: Send, 
        label: 'Sent Interests', 
        count: counts.sent,
        active: activeView === 'sent-interests' 
      },
      { 
        href: '/dashboard/member?view=received-interests', 
        icon: Inbox, 
        label: 'Received Interests', 
        count: counts.received,
        active: activeView === 'received-interests' 
      },
      { 
        href: '/dashboard/member?view=notifications', 
        icon: Bell, 
        label: 'Notifications', 
        count: counts.notifications,
        active: activeView === 'notifications' 
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
      label: 'truSathi Team', 
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
      <div className="p-6 border-b border-slate-100">
        <Logo size="md" />
      </div>

      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">User Identity</p>
        <p className="text-sm font-bold text-slate-800 truncate">{user?.displayName || 'Active Member'}</p>
        <div className="flex items-center gap-1.5 mt-1">
           <div className={`w-1.5 h-1.5 rounded-full ${user?.role === 'member' ? 'bg-rose-500' : 'bg-rose-500'}`}></div>
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
            <link.icon size={18} className={link.active ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-500'} />
            <span className="flex-1">{link.label}</span>
            {!!(link as any).count && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                link.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {(link as any).count}
              </span>
            )}
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

      <div className="p-4 border-t border-slate-100 space-y-1">
         <Link
           href="/"
           className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all font-bold text-sm"
         >
           <Home size={18} />
           Back to Home
         </Link>
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
         >
           <LogOut size={18} />
           Sign Out
         </button>
      </div>
    </aside>
  );
}
