"use client";

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function NotificationBell() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      where('isRead', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Link 
      href="/dashboard/member?view=notifications" 
      className="relative p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
    >
      <Bell size={20} className="group-hover:rotate-12 transition-transform" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
