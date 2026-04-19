"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Heart, MessageCircle, X } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot, limit, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: any;
  link?: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Unread count listener
    const unreadQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      where('isRead', '==', false)
    );

    const unsubUnread = onSnapshot(unreadQuery, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    // Recent notifications listener (removed orderBy to avoid index requirement)
    const recentQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubRecent = onSnapshot(recentQuery, (snapshot) => {
      const sorted = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as Notification))
        .slice(0, 4);
      setRecentNotifs(sorted);
    });

    return () => {
      unsubUnread();
      unsubRecent();
    };
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { isRead: true });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const formatTimeAgo = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'interest': return <Heart size={14} className="text-rose-500" strokeWidth={3} />;
      case 'message': return <MessageCircle size={14} className="text-indigo-500" strokeWidth={3} />;
      default: return <Bell size={14} className="text-slate-400" strokeWidth={3} />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl transition-all group ${
          isOpen ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
        }`}
      >
        <Bell size={20} className={`${isOpen ? 'rotate-12' : 'group-hover:rotate-12'} transition-transform`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-300">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Recent Alerts</h4>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
           </div>

           <div className="max-h-[360px] overflow-y-auto">
              {recentNotifs.length > 0 ? (
                <div className="divide-y divide-slate-50">
                   {recentNotifs.map((notif) => (
                     <div 
                        key={notif.id} 
                        className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!notif.isRead ? 'bg-rose-50/20' : ''}`}
                        onClick={() => {
                           if (!notif.isRead) markAsRead(notif.id);
                           if (notif.link) window.location.href = notif.link;
                           setIsOpen(false);
                        }}
                     >
                        {!notif.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-full"></div>}
                        <div className="flex gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                             notif.type === 'interest' ? 'bg-rose-50' : 'bg-indigo-50'
                           }`}>
                              {getIcon(notif.type)}
                           </div>
                            <div className="space-y-1 min-w-0 flex-1">
                               <div className="flex items-center justify-between gap-2">
                                  <p className="font-black text-slate-900 text-[11px] tracking-tight truncate uppercase">{notif.title}</p>
                                  <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">{formatTimeAgo(notif.createdAt)}</span>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{notif.message}</p>
                            </div>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                   <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <Bell size={24} strokeWidth={1} />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No new alerts</p>
                </div>
              )}
           </div>

           <Link 
             href={user?.role === 'group-admin' ? "/dashboard/group-admin?view=notifications" : "/dashboard/member?view=notifications"}
             onClick={() => setIsOpen(false)}
             className="block py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border-t border-slate-50 hover:bg-indigo-50 transition-all"
           >
              See All Notifications
           </Link>
        </div>
      )}
    </div>
  );
}
