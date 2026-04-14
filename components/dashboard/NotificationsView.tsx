"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot, orderBy, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types/notification';
import { Bell, Clock, CheckCircle2, Trash2, ShieldAlert, MessageCircle, Heart, Star, Loader2, Inbox } from 'lucide-react';

export default function NotificationsView() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    try {
      await Promise.all(unread.map(n => markAsRead(n.id!)));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'interest': return <Heart className="text-rose-500" size={20} />;
      case 'message': return <MessageCircle className="text-indigo-500" size={20} />;
      case 'favorite': return <Star className="text-amber-500" size={20} />;
      case 'admin_alert': return <ShieldAlert className="text-rose-600" size={20} />;
      default: return <Bell className="text-slate-400" size={20} />;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-rose-600" size={48} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing alerts...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Bell className="text-rose-600" /> Notifications
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
              {notifications.filter(n => !n.isRead).length} New
            </span>
          )}
        </h2>
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl shadow-rose-100/10">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-200">
            <Inbox size={40} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No notifications yet</h3>
          <p className="text-slate-500 font-medium">We'll alert you here when someone expresses interest or sends a message.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`group flex items-start gap-5 p-6 rounded-[2.5rem] border transition-all active:scale-[0.99] ${
                notif.isRead 
                  ? 'bg-white border-slate-50 opacity-60 grayscale-[0.5]' 
                  : 'bg-white border-rose-100 shadow-xl shadow-rose-100/20'
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                notif.isRead ? 'bg-slate-50' : 'bg-rose-50'
              }`}>
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-black tracking-tight ${notif.isRead ? 'text-slate-700' : 'text-slate-900 text-lg'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock size={12} />
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                    <button 
                      onClick={() => deleteNotification(notif.id!)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {notif.message}
                </p>
                {!notif.isRead && (
                  <button 
                    onClick={() => markAsRead(notif.id!)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600"
                  >
                    <CheckCircle2 size={12} /> Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
