"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types/notification';
import { Bell, CheckCircle, Trash2, ExternalLink, Calendar, MessageSquare, Heart, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsView() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ ...d.data(), id: d.id } as Notification));
      setNotifications(fetched);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(db);
      unread.forEach(notif => {
        if (notif.id) batch.update(doc(db, 'notifications', notif.id), { isRead: true });
      });
      await batch.commit();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const clearAll = async () => {
    if (!user || !window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach(notif => {
        if (notif.id) batch.delete(doc(db, 'notifications', notif.id));
      });
      await batch.commit();
      setNotifications([]);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={20} className="text-indigo-500" />;
      case 'interest': return <ExternalLink size={20} className="text-emerald-500" />;
      case 'favorite': return <Heart size={20} className="text-rose-500 fill-rose-500" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
               <Bell size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Notification Hub</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Stay updated on your activity</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white border border-slate-100 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
            >
               Mark All Read
            </button>
            <button 
              onClick={clearAll}
              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
               Clear All
            </button>
         </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Bell size={40} />
           </div>
           <h3 className="text-2xl font-black text-slate-800">All caught up!</h3>
           <p className="text-slate-500 mt-2">New notifications will appear here when they arrive.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Link
              key={notif.id}
              href={notif.link}
              className={`group flex items-start gap-5 p-6 rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-slate-100 relative ${
                notif.isRead ? 'bg-white border-slate-100' : 'bg-indigo-50/20 border-indigo-100'
              }`}
            >
              {!notif.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-indigo-500 rounded-full"></div>}
              
              <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                 {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2 mb-1">
                   <h4 className="font-black text-slate-900 truncate">{notif.title}</h4>
                   {!notif.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>}
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-4 mt-3">
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <Clock size={12} /> {formatDistanceToNow(new Date(notif.createdAt))} ago
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <Calendar size={12} /> {new Date(notif.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </div>

              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <ExternalLink size={18} />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
