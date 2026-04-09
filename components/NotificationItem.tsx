"use client";

import React from 'react';
import { MessageSquare, Heart, ExternalLink, CheckCircle, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import Link from 'next/link';

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onClear: (e: React.MouseEvent, id: string) => void;
  onClose: () => void;
}

export default function NotificationItem({ notification, onRead, onClear, onClose }: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={18} className="text-indigo-500" />;
      case 'interest': return <ExternalLink size={18} className="text-emerald-500" />;
      case 'favorite': return <Heart size={18} className="text-rose-500 fill-rose-500" />;
      default: return <CheckCircle size={18} className="text-slate-400" />;
    }
  };

  return (
    <Link
      href={notification.link}
      onClick={() => {
        if (!notification.isRead && notification.id) onRead(notification.id);
        onClose();
      }}
      className={`flex items-start gap-4 p-5 transition-all hover:bg-slate-50 relative group ${
        !notification.isRead ? 'bg-indigo-50/30' : ''
      }`}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
      )}
      
      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative group-hover:scale-110 transition-transform duration-300">
        {getIcon(notification.type)}
        {!notification.isRead && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></div>}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center justify-between mb-1">
          <p className="font-black text-slate-900 text-[13px] leading-tight truncate">{notification.title}</p>
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium mb-2">{notification.message}</p>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <Clock size={10} />
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </div>
      </div>

      <button 
        onClick={(e) => onClear(e, notification.id!)}
        className="absolute right-4 top-5 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"
      >
        <Trash2 size={16} />
      </button>
    </Link>
  );
}
