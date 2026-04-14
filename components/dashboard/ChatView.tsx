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
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import {
  Loader2, MessageCircle, Send, User, ArrowLeft,
  MoreVertical, CheckCircle2, Clock, ShieldCheck, Crown,
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
    if (!user || connections.length === 0) return;

    const unsubscribes = connections.map((connection) => {
      const convId = [user.uid, connection.otherId].sort().join('_');
      return onSnapshot(doc(db, 'conversations', convId), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as ConversationDoc;
          setLastMessages((prev) => ({ ...prev, [connection.otherId]: data.lastMessage || '' }));
        }
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [connections, user]);

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

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.12)] overflow-hidden flex h-[780px] animate-in slide-in-from-bottom-8 duration-1000 relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className={`w-full md:w-96 border-r border-slate-200/30 flex flex-col bg-white/40 backdrop-blur-3xl ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-10 border-b border-slate-200/30">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Messaging</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Secure Channels Active</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {connections.map((connection) => (
            <button
              key={connection.otherId}
              onClick={() => setSelectedChat(connection)}
              className={`w-full flex items-center gap-5 p-5 rounded-[2.5rem] transition-all duration-500 group ${
                selectedChat?.otherId === connection.otherId
                  ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] scale-[1.02] z-10'
                  : 'hover:bg-white/80 text-slate-700 hover:shadow-lg hover:shadow-indigo-500/5'
              }`}
            >
              <div className={`relative w-16 h-16 rounded-[1.5rem] overflow-hidden shrink-0 border-4 transition-transform duration-500 group-hover:scale-110 ${
                selectedChat?.otherId === connection.otherId ? 'border-indigo-400/50' : 'border-white shadow-xl'
              }`}>
                {connection.otherImage ? (
                  <Image src={connection.otherImage} alt={connection.otherName} fill className="object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center font-black ${
                    connection.kind === 'super-admin' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {connection.kind === 'super-admin' ? <Crown size={28} /> : <User size={28} />}
                  </div>
                )}
              </div>
              
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="font-black text-[15px] truncate tracking-tight">{connection.otherName}</p>
                  {connection.kind === 'super-admin' && (
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      selectedChat?.otherId === connection.otherId ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                    }`}>Admin</span>
                  )}
                </div>
                <p className={`text-xs truncate font-semibold leading-tight ${
                  selectedChat?.otherId === connection.otherId ? 'text-indigo-100/70' : 'text-slate-400'
                }`}>
                  {lastMessages[connection.otherId] || (connection.kind === 'super-admin' ? 'Trust review channel...' : 'Start syncing...')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-slate-50/10 backdrop-blur-sm ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            <div className="px-10 py-8 border-b border-slate-200/30 bg-white/60 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-3 -ml-3 text-slate-400 hover:text-indigo-600 transition-colors">
                  <ArrowLeft size={28} />
                </button>
                <div className="relative group">
                  <div className={`w-14 h-14 rounded-[1.5rem] border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center font-black text-2xl shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                    selectedChat.kind === 'super-admin' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {selectedChat.otherImage ? (
                      <Image src={selectedChat.otherImage} alt={selectedChat.otherName} fill className="object-cover" />
                    ) : selectedChat.kind === 'super-admin' ? (
                      <Crown size={26} />
                    ) : (
                      selectedChat.otherName.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-2xl tracking-tighter leading-none mb-1.5">{selectedChat.otherName}</h4>
                  <div className="flex items-center gap-2.5">
                    {selectedChat.kind === 'super-admin' ? (
                      <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg flex items-center gap-1.5 border border-amber-500/20">
                         <Crown size={12} className="text-amber-500" />
                         <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Trust Desk</span>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 bg-indigo-500/10 rounded-lg flex items-center gap-1.5 border border-indigo-500/20">
                         <ShieldCheck size={12} className="text-indigo-500" />
                         <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Authenticated</span>
                      </div>
                    )}
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedChat.profileNo}</p>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-xl"><MoreVertical size={24} /></button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white shadow-inner flex items-center justify-center text-slate-300 border border-slate-50">
                    {selectedChat.kind === 'super-admin' ? <Crown size={48} strokeWidth={1} /> : <MessageCircle size={48} strokeWidth={1} />}
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xl font-black text-slate-400 uppercase tracking-widest">Private Channel</h5>
                    <p className="text-sm font-bold text-slate-400 italic max-w-xs mx-auto">
                      {selectedChat.kind === 'super-admin'
                        ? 'Submit your profile for screening or ask for expert assistance.'
                        : 'Your conversation is end-to-end encrypted and visible only to you.'}
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message, index) => {
                const isMe = message.senderId === user?.uid;
                const nextIsMe = messages[index + 1]?.senderId === message.senderId;

                return (
                  <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`group relative max-w-[85%] lg:max-w-[70%] p-5 lg:p-6 transition-all shadow-xl hover:shadow-2xl ${
                      isMe
                        ? `bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-[2.5rem] ${nextIsMe ? 'rounded-br-xl' : 'rounded-br-none'} shadow-indigo-500/20`
                        : `bg-white/80 backdrop-blur-xl text-slate-700 rounded-[2.5rem] ${nextIsMe ? 'rounded-bl-xl' : 'rounded-bl-none'} border border-white/60`
                    }`}>
                      <p className="text-[15px] lg:text-base font-bold leading-relaxed whitespace-pre-wrap tracking-tight">{message.text}</p>
                      <div className={`text-[9px] font-black mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-60 transition-all duration-300 ${
                        isMe ? 'justify-end text-indigo-50' : 'text-slate-400'
                      }`}>
                        <Clock size={10} />
                        {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Syncing...'}
                        {isMe && <CheckCircle2 size={10} className="ml-1 opacity-100" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-10 bg-white/40 backdrop-blur-3xl border-t border-slate-200/30">
              <form onSubmit={handleSend} className="relative group">
                <div className="absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 rounded-[3rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative flex items-center gap-5 bg-white/80 backdrop-blur-xl rounded-[3rem] p-3 pl-8 pr-3 border border-white shadow-2xl shadow-indigo-500/5 focus-within:border-indigo-500/30 transition-all">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={selectedChat.kind === 'super-admin' ? 'Type your request to truSathi Team...' : `Message ${selectedChat.otherName}...`}
                    className="flex-1 bg-transparent py-5 text-slate-800 font-bold text-base outline-none placeholder:text-slate-400 tracking-tight"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2rem] flex items-center justify-center hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-90 disabled:opacity-20 disabled:grayscale disabled:scale-95 group/btn"
                  >
                    <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in duration-1000 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full"></div>
            <div className="relative mb-12 transform hover:scale-110 transition-transform duration-700">
              <div className="w-40 h-40 bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center text-indigo-100 relative z-10 border border-slate-50/50">
                <MessageCircle size={80} strokeWidth={1} className="text-indigo-600" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-bounce">
                <ShieldCheck size={24} />
              </div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight text-center">Encrypted Workspace</h3>
            <p className="text-slate-500 max-w-sm font-semibold text-xl leading-relaxed text-center opacity-70">
              Select a connection or contact the trust desk to start a secure conversation.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.04);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
