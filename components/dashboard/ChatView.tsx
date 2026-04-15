"use client";
import React, { useEffect, useRef, useState } from 'react';
import { db } from '@/app/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import {
  Loader2, MessageCircle, Send, User, ArrowLeft,
  MoreVertical, CheckCircle2, Clock, ShieldCheck, Crown, X,
} from 'lucide-react';
import { sendNotification } from '@/app/lib/notification-service';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Connection {
  id: string;
  otherId: string;
  otherName: string;
  otherImage: string;
  profileNo: string;
  kind?: 'member' | 'super-admin';
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: {
    toDate?: () => Date;
  } | null;
}

interface ConversationDoc {
  lastMessage?: string;
  lastMessageAt?: unknown;
  participants: string[];
}

export default function ChatView() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedChat, setSelectedChat] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConnections = async () => {
      try {
        const sentAccepted = query(
          collection(db, 'interests'),
          where('senderId', '==', user.uid),
          where('status', '==', 'accepted'),
        );
        const receivedAccepted = query(
          collection(db, 'interests'),
          where('receiverId', '==', user.uid),
          where('status', '==', 'accepted'),
        );
        const superAdminQuery = query(
          collection(db, 'users'),
          where('role', '==', 'super-admin'),
          limit(1),
        );

        const [sentSnap, receivedSnap, superAdminSnap] = await Promise.all([
          getDocs(sentAccepted),
          getDocs(receivedAccepted),
          getDocs(superAdminQuery),
        ]);

        const seen = new Set<string>();
        const connected: Connection[] = [];

        sentSnap.docs.forEach((interestDoc) => {
          const data = interestDoc.data();
          if (data.receiverId && !seen.has(data.receiverId)) {
            connected.push({
              id: interestDoc.id,
              otherId: data.receiverId,
              otherName: data.profileName,
              otherImage: data.profileImage,
              profileNo: data.profileNo,
              kind: 'member',
            });
            seen.add(data.receiverId);
          }
        });

        receivedSnap.docs.forEach((interestDoc) => {
          const data = interestDoc.data();
          if (data.senderId && !seen.has(data.senderId)) {
            connected.push({
              id: interestDoc.id,
              otherId: data.senderId,
              otherName: data.senderName,
              otherImage: data.senderImage || '',
              profileNo: data.profileNo || 'Member',
              kind: 'member',
            });
            seen.add(data.senderId);
          }
        });

        if (!superAdminSnap.empty) {
          const superAdminDoc = superAdminSnap.docs[0];
          if (!seen.has(superAdminDoc.id) && superAdminDoc.id !== user.uid) {
            connected.unshift({
              id: `super-admin-${superAdminDoc.id}`,
              otherId: superAdminDoc.id,
              otherName: superAdminDoc.data().displayName || 'truSathi Team',
              otherImage: '',
              profileNo: 'Trust Desk',
              kind: 'super-admin',
            });
          }
        }

        setConnections(connected);
      } catch (err) {
        console.error('Fetch connections error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user) return;

    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    const convRef = doc(db, 'conversations', convId);

    const ensureConversation = async () => {
      const snap = await getDoc(convRef);
      if (!snap.exists()) {
        await setDoc(convRef, {
          participants: [user.uid, selectedChat.otherId],
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
        });
      }
    };

    ensureConversation();

    const messagesQuery = query(
      collection(db, `conversations/${convId}/messages`),
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snap) => {
      const nextMessages = snap.docs.map((messageDoc) => ({ ...messageDoc.data(), id: messageDoc.id } as Message));
      setMessages(nextMessages);
    }, (err) => {
      console.error('onSnapshot error:', err);
    });

    return () => unsubscribe();
  }, [selectedChat, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // SINGLE listener for all conversations where user is a participant
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const messages: Record<string, string> = {};
      snap.docs.forEach(d => {
        const data = d.data() as ConversationDoc;
        const otherId = data.participants.find(p => p !== user.uid);
        if (otherId) {
          messages[otherId] = data.lastMessage || '';
        }
      });
      setLastMessages(messages);
    }, (err) => {
      console.error("Conversations sync error:", err);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!connections.length || selectedChat) return;

    const requestedChat = searchParams.get('chat');
    if (requestedChat === 'super-admin') {
      const adminConnection = connections.find((connection) => connection.kind === 'super-admin');
      if (adminConnection) {
        setSelectedChat(adminConnection);
      }
      return;
    }

    if (requestedChat) {
      const requestedConnection = connections.find((connection) => connection.otherId === requestedChat);
      if (requestedConnection) {
        setSelectedChat(requestedConnection);
      }
    }
  }, [connections, searchParams, selectedChat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const text = newMessage.trim();
    setNewMessage('');

    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    const convRef = doc(db, 'conversations', convId);

    try {
      await addDoc(collection(db, `conversations/${convId}/messages`), {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(convRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      });

      await sendNotification({
        recipientId: selectedChat.otherId,
        senderId: user.uid,
        senderName: user.displayName || 'A Member',
        type: 'message',
        title: selectedChat.kind === 'super-admin' ? 'New Team Message' : 'New Message',
        message: text.length > 50 ? `${text.substring(0, 47)}...` : text,
        link: selectedChat.kind === 'super-admin'
          ? '/dashboard/super-admin'
          : '/dashboard/member?view=chats',
      });
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Opening secure channels...</p>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-slate-200 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
          <MessageCircle size={48} strokeWidth={1} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3">No Conversations Yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg px-6">
          Once an interest is accepted, or you start a trust review chat with the super admin, conversations will appear here.
        </p>
      </div>
    );
  }

  // Helper to group messages by date
  const groupMessagesByDate = (msgList: Message[]) => {
    const groups: Record<string, Message[]> = {};
    msgList.forEach((m) => {
      const date = m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : 'Today';
      const label = isToday(m.createdAt?.toDate?.()) ? 'Today' : 
                    isYesterday(m.createdAt?.toDate?.()) ? 'Yesterday' : date;
      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });
    return groups;
  };

  const isToday = (date?: Date) => {
    if (!date) return true;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (date?: Date) => {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  const handleClearChat = async () => {
    if (!selectedChat || !user || !confirm("Clear all messages in this conversation?")) return;
    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    try {
      const msgs = await getDocs(collection(db, `conversations/${convId}/messages`));
      await Promise.all(msgs.docs.map(d => deleteDoc(d.ref)));
      await updateDoc(doc(db, 'conversations', convId), {
        lastMessage: '',
        lastMessageAt: serverTimestamp()
      });
      setMessages([]);
    } catch (err) {
      console.error("Clear chat error:", err);
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <Loader2 className="animate-spin text-rose-600" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Opening secure channels...</p>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-slate-200 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
          <MessageCircle size={48} strokeWidth={1} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3">No Conversations Yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg px-6">
          Once an interest is accepted, conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.08)] overflow-hidden flex h-[780px] animate-in slide-in-from-bottom-8 duration-1000 relative">
      {/* Sidebar List */}
      <div className={`w-full md:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-slate-100 bg-white">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Messages</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">End-to-End Encrypted</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {connections.map((connection) => (
            <button
              key={connection.otherId}
              onClick={() => setSelectedChat(connection)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 group ${
                selectedChat?.otherId === connection.otherId
                  ? 'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100'
                  : 'hover:bg-white/60 text-slate-700'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 ${
                  selectedChat?.otherId === connection.otherId ? 'border-rose-200 shadow-md' : 'border-white shadow-sm'
                }`}>
                  {connection.otherImage ? (
                    <Image src={connection.otherImage} alt={connection.otherName} fill className="object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center font-black ${
                      connection.kind === 'super-admin' ? 'bg-amber-100 text-amber-600' : 'bg-rose-50 text-rose-500'
                    }`}>
                      {connection.kind === 'super-admin' ? <Crown size={24} /> : connection.otherName.charAt(0)}
                    </div>
                  )}
                </div>
                {selectedChat?.otherId === connection.otherId && (
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                )}
              </div>
              
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-black text-sm truncate tracking-tight text-slate-900">{connection.otherName}</p>
                  <p className="text-[9px] font-bold text-slate-400 whitespace-nowrap uppercase">
                    {/* Simplified time for last message */}
                    12:45 PM
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                   <p className="text-[11px] truncate font-medium text-slate-500 line-clamp-1">
                     {lastMessages[connection.otherId] || 'Start a conversation...'}
                   </p>
                   {/* Unread indicator simulation */}
                   {Math.random() > 0.8 && connection.otherId !== selectedChat?.otherId && (
                      <span className="w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-200">2</span>
                   )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
        {/* WhatsApp Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/650/wallpaper-whatsapp-background-dark-pattern.jpg')] bg-repeat"></div>

        {selectedChat ? (
          <>
            <div className="px-8 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center font-black text-lg shrink-0 ${
                    selectedChat.kind === 'super-admin' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {selectedChat.otherImage ? (
                      <Image src={selectedChat.otherImage} alt={selectedChat.otherName} fill className="object-cover" />
                    ) : selectedChat.kind === 'super-admin' ? (
                      <Crown size={22} />
                    ) : (
                      selectedChat.otherName.charAt(0)
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">{selectedChat.otherName}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedChat.profileNo}</p>
                  </div>
                </div>
              </div>
              <div className="relative group/menu">
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all"><MoreVertical size={20} /></button>
                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300 z-50">
                   <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2 w-48 overflow-hidden">
                      <button onClick={handleClearChat} className="w-full text-left px-5 py-3 text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-3">
                         <X size={14} /> Clear Chat
                      </button>
                   </div>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar relative">
              {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date} className="space-y-6">
                  <div className="flex justify-center my-8">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm border border-slate-200/50">
                      {date}
                    </span>
                  </div>
                  {msgs.map((message, index) => {
                    const isMe = message.senderId === user?.uid;
                    return (
                      <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`relative max-w-[85%] lg:max-w-[70%] p-3.5 px-4 shadow-md ${
                          isMe
                            ? 'bg-[#dcf8c6] text-slate-800 rounded-2xl rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-2xl rounded-tl-none'
                        }`}>
                          <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap tracking-normal">{message.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-slate-500' : 'text-slate-400'}`}>
                             <span className="text-[9px] font-bold opacity-60">
                                {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                             </span>
                             {isMe && (
                                <div className="flex items-center ml-0.5">
                                   <CheckCircle2 size={12} className="text-sky-500" />
                                   <CheckCircle2 size={12} className="text-sky-500 -ml-1.5" />
                                </div>
                             )}
                          </div>
                          {/* Triangle tail simulation */}
                          {isMe ? (
                             <div className="absolute top-0 right-[-8px] w-0 h-0 border-l-[10px] border-l-[#dcf8c6] border-b-[10px] border-b-transparent"></div>
                          ) : (
                             <div className="absolute top-0 left-[-8px] w-0 h-0 border-r-[10px] border-r-white border-b-[10px] border-b-transparent"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/50 z-20">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-white px-6 py-4 rounded-3xl text-slate-800 font-medium text-sm outline-none shadow-sm focus:shadow-md transition-all border border-slate-200 focus:border-rose-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center hover:bg-rose-700 hover:shadow-lg shadow-rose-200 transition-all active:scale-90 disabled:opacity-40"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in duration-1000">
            <div className="relative mb-12 transform hover:scale-105 transition-transform duration-700">
              <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl flex items-center justify-center text-rose-50 border border-slate-50">
                <MessageCircle size={64} strokeWidth={1} className="text-rose-600" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Private Workspace</h3>
            <p className="text-slate-500 max-w-sm font-medium text-lg text-center opacity-70">
              Your conversations are secure and encrypted. Select a chat to begin.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
