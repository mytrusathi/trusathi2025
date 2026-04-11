"use client";

import React, { useState, useEffect } from 'react';
import { Bell, ExternalLink } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types/notification';
import Link from 'next/link';

import NotificationItem from './NotificationItem';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const notifs = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Notification));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err) {
      console.error(err);
    }
  };

  const clearNotification = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className={`relative p-3 rounded-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] scale-105' 
            : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'
        }`}
      >
        <Bell size={22} className={isOpen ? 'animate-bounce' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 border-[3px] border-white rounded-full flex items-center justify-center text-[8px] font-black text-white animate-in zoom-in-50 duration-500 shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={toggleOpen}></div>
          
          <div className="absolute right-0 top-full mt-4 w-96 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden z-[100] animate-in slide-in-from-top-4 zoom-in-95 duration-300 origin-top-right">
            <div className="p-6 border-b border-slate-100/50 flex items-center justify-between">
               <div>
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em]">Activity Hub</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Stay updated with your latest matches</p>
               </div>
               <span className="text-[10px] font-black px-3 py-1 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-100">{unreadCount} NEW</span>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
               {notifications.length === 0 ? (
                 <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                       <Bell size={32} />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No New Alerts</p>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-50/50">
                   {notifications.map((notif) => (
                      <NotificationItem 
                        key={notif.id}
                        notification={notif}
                        onRead={markAsRead}
                        onClear={clearNotification}
                        onClose={() => setIsOpen(false)}
                      />
                   ))}
                 </div>
               )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 group">
               <Link 
                 href={user.role === 'member' ? '/dashboard/member?view=notifications' : '/dashboard/group-admin?view=notifications'}
                 onClick={() => setIsOpen(false)}
                 className="flex items-center justify-center gap-2 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all"
               >
                  See All Notifications
                  <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
