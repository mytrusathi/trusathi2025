"use client";

import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Heart, MapPin, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types/notification';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={16} className="text-indigo-500" />;
      case 'interest': return <ExternalLink size={16} className="text-emerald-500" />;
      case 'favorite': return <Heart size={16} className="text-rose-500 fill-rose-500" />;
      default: return <CheckCircle size={16} className="text-slate-400" />;
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className={`relative p-2.5 rounded-2xl transition-all ${
          isOpen ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
        }`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white animate-in zoom-in-50 duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile closing */}
          <div className="fixed inset-0 z-[90]" onClick={toggleOpen}></div>
          
          <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
               <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase tracking-widest">Notifications</h4>
               <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-500 rounded-lg">{unreadCount} New</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
               {notifications.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">
                    <Bell size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest italic">All Quiet</p>
                 </div>
               ) : (
                 notifications.map((notif) => (
                   <Link
                     key={notif.id}
                     href={notif.link}
                     onClick={() => {
                        if (!notif.isRead && notif.id) markAsRead(notif.id);
                        setIsOpen(false);
                     }}
                     className={`flex items-start gap-4 p-5 border-b border-slate-50 transition-colors hover:bg-slate-50 relative group ${
                        !notif.isRead ? 'bg-indigo-50/20' : ''
                     }`}
                   >
                     {!notif.isRead && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>}
                     
                     <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative">
                        {getIcon(notif.type)}
                     </div>

                     <div className="flex-1 min-w-0 pr-6">
                        <p className="font-black text-slate-800 text-sm leading-tight mb-0.5">{notif.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{notif.message}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                           {formatDistanceToNow(new Date(notif.createdAt))} ago
                        </p>
                     </div>

                     <button 
                       onClick={(e) => clearNotification(e, notif.id!)}
                       className="absolute right-3 top-5 opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                     >
                        <Trash2 size={14} />
                     </button>
                   </Link>
                 ))
               )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                 <button 
                   onClick={() => {/* Mark all as read logic */}}
                   className="w-full text-center py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-colors"
                 >
                    View All Activity
                 </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
