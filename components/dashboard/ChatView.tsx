"use client";
import React, { useEffect, useState, useRef } from 'react';
import { db } from '@/app/lib/firebase';
import { 
  collection, query, where, getDocs, orderBy, onSnapshot, 
  addDoc, serverTimestamp, setDoc, doc, getDoc, updateDoc 
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  Loader2, MessageCircle, Send, User, ArrowLeft, 
  MoreVertical, Phone, Info, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import { sendNotification } from '@/app/lib/notification-service';
import Image from 'next/image';

interface Connection {
  id: string;
  otherId: string;
  otherName: string;
  otherImage: string;
  profileNo: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface ConversationDoc {
  lastMessage?: string;
  lastMessageAt?: any;
  participants: string[];
}

export default function ChatView() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedChat, setSelectedChat] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch "Accepted" interests to find connections
  useEffect(() => {
    if (!user) return;
    const fetchConnections = async () => {
      try {
        const q1 = query(collection(db, 'interests'), where('senderId', '==', user.uid), where('status', '==', 'accepted'));
        const q2 = query(collection(db, 'interests'), where('receiverId', '==', user.uid), where('status', '==', 'accepted'));
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const seen = new Set();
        const connected: Connection[] = [];
        
        snap1.docs.forEach(doc => {
          const data = doc.data();
          if (!seen.has(data.receiverId)) {
            connected.push({
              id: doc.id,
              otherId: data.receiverId,
              otherName: data.profileName,
              otherImage: data.profileImage,
              profileNo: data.profileNo
            });
            seen.add(data.receiverId);
          }
        });

        snap2.docs.forEach(doc => {
          const data = doc.data();
          if (!seen.has(data.senderId)) {
            connected.push({
              id: doc.id,
              otherId: data.senderId,
              otherName: data.senderName,
              otherImage: data.senderImage || '', // Added senderImage if available
              profileNo: data.profileNo || 'Member'
            });
            seen.add(data.senderId);
          }
        });

        setConnections(connected);
      } catch (err) {
        console.error("Fetch connections error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [user]);

  // 2. Real-time Message Listener & Conversation Doc Creation
  useEffect(() => {
    if (!selectedChat || !user) return;
    
    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    const convRef = doc(db, 'conversations', convId);

    // Ensure conversation doc exists for permission rules
    const ensureConversation = async () => {
      const snap = await getDoc(convRef);
      if (!snap.exists()) {
        await setDoc(convRef, {
          participants: [user.uid, selectedChat.otherId],
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp()
        });
      }
    };
    ensureConversation();

    const q = query(
      collection(db, `conversations/${convId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Message));
      setMessages(msgs);
    }, (err) => {
      console.error("onSnapshot error:", err);
    });

    return () => unsubscribe();
  }, [selectedChat, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 3. Last Message Previews
  useEffect(() => {
    if (!user || connections.length === 0) return;
    
    const unsubscribes = connections.map(c => {
      const convId = [user.uid, c.otherId].sort().join('_');
      return onSnapshot(doc(db, 'conversations', convId), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as ConversationDoc;
          setLastMessages(prev => ({ ...prev, [c.otherId]: data.lastMessage || '' }));
        }
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [connections, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const text = newMessage.trim();
    setNewMessage(''); // Immediate clear for UX

    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    const convRef = doc(db, 'conversations', convId);

    try {
      // Add message
      await addDoc(collection(db, `conversations/${convId}/messages`), {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });

      // Update conversation summary
      await updateDoc(convRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp()
      });

      // Send Notification
      await sendNotification({
        recipientId: selectedChat.otherId,
        senderId: user.uid,
        senderName: user.displayName || 'A Member',
        type: 'message',
        title: 'New Message',
        message: text.length > 50 ? text.substring(0, 47) + '...' : text,
        link: '/dashboard/member?view=chats'
      });

    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Encrypting Channels...</p>
    </div>
  );

  if (connections.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-slate-200 animate-in fade-in zoom-in duration-700">
         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
            <MessageCircle size={48} strokeWidth={1} />
         </div>
         <h3 className="text-3xl font-black text-slate-900 mb-3">No Conversations Yet</h3>
         <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg px-6">
            Connections will appear here once your interests are accepted. Start exploring!
         </p>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex h-[750px] animate-in slide-in-from-bottom-8 duration-1000">
      
      {/* Sidebar: Connections */}
      <div className={`w-full md:w-96 border-r border-slate-100/50 flex flex-col bg-white/50 backdrop-blur-md ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-8 border-b border-slate-100/50">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Direct Contacts</p>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {connections.map(c => (
              <button 
                key={c.otherId}
                onClick={() => setSelectedChat(c)}
                className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300 ${
                  selectedChat?.otherId === c.otherId 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-[1.02]' 
                  : 'hover:bg-indigo-50/50 text-slate-700 hover:translate-x-1'
                }`}
              >
                  <div className={`relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 ${selectedChat?.otherId === c.otherId ? 'border-indigo-400' : 'border-white shadow-sm'}`}>
                     {c.otherImage ? <Image src={c.otherImage} alt={c.otherName} fill className="object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black"><User size={24} /></div>}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                     <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-black text-sm truncate">{c.otherName}</p>
                        <span className={`text-[8px] font-black tracking-widest uppercase ${selectedChat?.otherId === c.otherId ? 'text-indigo-200' : 'text-slate-300'}`}>
                          {lastMessages[c.otherId] ? 'Active' : ''}
                        </span>
                     </div>
                     <p className={`text-xs truncate font-medium ${selectedChat?.otherId === c.otherId ? 'text-indigo-100 opacity-80' : 'text-slate-400'}`}>
                        {lastMessages[c.otherId] || 'Start a conversation...'}
                     </p>
                  </div>
              </button>
            ))}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-50/20 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
         {selectedChat ? (
            <>
               {/* Chat Header */}
               <div className="px-8 py-6 border-b border-slate-100/50 bg-white/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-5">
                     <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600">
                        <ArrowLeft size={24} />
                     </button>
                     <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-indigo-600 font-black text-xl shrink-0">
                           {selectedChat.otherImage ? <Image src={selectedChat.otherImage} alt="User" fill className="object-cover" /> : selectedChat.otherName.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 tracking-tight leading-tight mb-1">{selectedChat.otherName}</h4>
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={12} className="text-indigo-500" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedChat.profileNo} • Authenticated</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors"><Phone size={20} /></button>
                     <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors"><MoreVertical size={20} /></button>
                  </div>
               </div>

               {/* Messages Container */}
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                       <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                          <MessageCircle size={32} />
                       </div>
                       <p className="text-sm font-bold text-slate-500 italic">No message history yet.<br/>Type something to break the ice!</p>
                    </div>
                  )}
                  {messages.map((m, idx) => {
                    const isMe = m.senderId === user?.uid;
                    const nextIsMe = messages[idx+1]?.senderId === m.senderId;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                         <div className={`group relative max-w-[70%] lg:max-w-[60%] p-4 lg:p-5 shadow-sm transition-all ${
                            isMe 
                            ? `bg-indigo-600 text-white rounded-[2rem] ${nextIsMe ? 'rounded-br-lg' : 'rounded-br-none'} shadow-xl shadow-indigo-100` 
                            : `bg-white text-slate-700 rounded-[2rem] ${nextIsMe ? 'rounded-bl-lg' : 'rounded-bl-none'} border border-slate-100`
                         }`}>
                            <p className="text-sm lg:text-base font-semibold leading-relaxed whitespace-pre-wrap">{m.text}</p>
                            <div className={`text-[9px] font-black mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-60 transition-opacity ${isMe ? 'justify-end text-indigo-50' : 'text-slate-400'}`}>
                               <Clock size={10} />
                               {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sending...'}
                               {isMe && <CheckCircle2 size={10} className="ml-1" />}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>

               {/* Professional Footer Input */}
               <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100/50">
                  <form onSubmit={handleSend} className="relative group">
                     <div className="absolute inset-0 bg-indigo-500/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                     <div className="relative flex items-center gap-4 bg-slate-50 rounded-[2rem] p-2 pl-6 pr-2 border border-slate-100 focus-within:border-indigo-500/30 focus-within:bg-white transition-all">
                        <input 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={`Message ${selectedChat.otherName}...`}
                          className="flex-1 bg-transparent py-4 text-slate-700 font-bold text-sm outline-none placeholder:text-slate-400"
                        />
                        <button 
                          type="submit" 
                          disabled={!newMessage.trim()}
                          className="w-12 h-12 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-90 disabled:opacity-30 disabled:grayscale disabled:scale-95"
                        >
                           <Send size={20} />
                        </button>
                     </div>
                  </form>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in zoom-in duration-1000">
               <div className="relative mb-10">
                  <div className="w-32 h-32 bg-indigo-50 rounded-[3rem] absolute -top-4 -left-4 animate-pulse"></div>
                  <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-indigo-100 relative z-10 border border-slate-50">
                     <MessageCircle size={64} strokeWidth={1} className="text-indigo-600" />
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your Safe Workspace</h3>
               <p className="text-slate-500 max-w-sm font-medium text-lg leading-relaxed">
                  Select a candidate to start discussing your future. Safe, secure, and respectful conversations.
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
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

// Fixed Lucide import name (added ShieldCheck to imports)
