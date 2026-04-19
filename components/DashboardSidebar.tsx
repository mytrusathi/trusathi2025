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
  if (isRole('super-admin')) {
    links.push({ 
      href: '/dashboard/super-admin', 
      icon: <Globe size={18} className="text-primary group-hover:rotate-12 transition-transform" />, 
      label: 'Master Console', 
      active: pathname === '/dashboard/super-admin'
    });
  }

  if (isRole('group-admin') || isRole('super-admin')) {
    links.push(
      { 
        href: '/dashboard/group-admin', 
        icon: <LayoutDashboard size={18} className="text-rose-500 group-hover:rotate-12 transition-transform" />, 
        label: 'Managed Profiles', 
        active: pathname === '/dashboard/group-admin' && !activeView 
      },
      { 
        href: '/dashboard/group-admin?view=community-link', 
        icon: <Globe size={18} className="text-sky-500 group-hover:rotate-12 transition-transform" />, 
        label: 'Community Link', 
        active: activeView === 'community-link' 
      },
      { 
        href: '/dashboard/group-admin?view=sent-interests', 
        icon: <Send size={18} className="text-emerald-500 group-hover:-translate-y-1 transition-transform" />, 
        label: 'Sent Interests', 
        active: activeView === 'sent-interests' 
      },
      { 
        href: '/dashboard/group-admin?view=received-interests', 
        icon: <Inbox size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />, 
        label: 'Received Interests', 
        active: activeView === 'received-interests' 
      },
      { 
        href: '/dashboard/group-admin?view=chats', 
        icon: <MessageCircle size={18} className="text-violet-500 group-hover:scale-110 transition-transform" />, 
        label: 'Messages', 
        active: activeView === 'chats' 
      },
      { 
        href: '/dashboard/group-admin?view=notifications', 
        icon: <Bell size={18} className="text-rose-400 animate-pulse" />, 
        label: 'Notifications', 
        active: activeView === 'notifications' 
      }
    );
  } else if (isRole('member')) {
    links.push(
      { 
        href: '/dashboard/member', 
        icon: <LayoutDashboard size={18} className="text-rose-500 group-hover:rotate-12 transition-transform" />, 
        label: 'Overview', 
        active: pathname === '/dashboard/member' && !activeView 
      },
      { 
        href: '/dashboard/member?view=my-profiles', 
        icon: <User size={18} className="text-sky-500 group-hover:scale-110 transition-transform" />, 
        label: 'My Profile', 
        active: activeView === 'my-profiles' 
      },
      { 
        href: '/dashboard/member?view=connects', 
        icon: <Users size={18} className="text-violet-500 group-hover:translate-x-1 transition-transform" />, 
        label: 'Your Connects', 
        count: counts.connects,
        active: activeView === 'connects' 
      },
      { 
        href: '/dashboard/member?view=favorites', 
        icon: <Heart size={18} className="text-rose-400 group-hover:scale-125 transition-transform" />, 
        label: 'Shortlisted', 
        count: counts.favs,
        active: activeView === 'favorites' 
      },
      { 
        href: '/dashboard/member?view=sent-interests', 
        icon: <Send size={18} className="text-emerald-500 group-hover:-translate-y-1 transition-transform" />, 
        label: 'Sent Interests', 
        count: counts.sent,
        active: activeView === 'sent-interests' 
      },
      { 
        href: '/dashboard/member?view=received-interests', 
        icon: <Inbox size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />, 
        label: 'Received Interests', 
        count: counts.received,
        active: activeView === 'received-interests' 
      },
      { 
        href: '/dashboard/member?view=notifications', 
        icon: <Bell size={18} className="text-indigo-500 animate-[bounce_2s_infinite]" />, 
        label: 'Notifications', 
        count: counts.notifications,
        active: activeView === 'notifications' 
      },
      { 
        href: '/dashboard/member?view=chats', 
        icon: <MessageCircle size={18} className="text-fuchsia-500 group-hover:rotate-6 transition-transform" />, 
        label: 'Messages', 
        active: activeView === 'chats' 
      },
      { 
        href: '/dashboard/member?view=partner-preferences', 
        icon: <SlidersHorizontal size={18} className="text-slate-600 group-hover:rotate-90 transition-transform" />, 
        label: 'Partner Preferences', 
        active: activeView === 'partner-preferences' 
      }
    );
  }

  // Team option ONLY for admins
  if (isRole('group-admin') || isRole('super-admin')) {
    links.push({ 
      href: '/dashboard/team', 
      icon: <Users size={18} className="text-indigo-600" />, 
      label: 'truSathi Team', 
      active: pathname === '/dashboard/team' 
    });
  }

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
            {link.icon}
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
    </aside>
  );
}
