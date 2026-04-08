"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, MessageCircle, Send, User, ArrowLeft } from 'lucide-react';
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

export default function ChatView() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedChat, setSelectedChat] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch "Accepted" interests to find connections
  useEffect(() => {
    if (!user) return;
    const fetchConnections = async () => {
      try {
        // Fetch interests where user is sender OR receiver and status is accepted
        const q1 = query(collection(db, 'interests'), where('senderId', '==', user.uid), where('status', '==', 'accepted'));
        const q2 = query(collection(db, 'interests'), where('receiverId', '==', user.uid), where('status', '==', 'accepted'));
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const seen = new Set();
        const connected: Connection[] = [];
        
        // Handling sent accepted
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

        // Handling received accepted
        snap2.docs.forEach(doc => {
          const data = doc.data();
          if (!seen.has(data.senderId)) {
            connected.push({
              id: doc.id,
              otherId: data.senderId,
              otherName: data.senderName, // We might need to fetch the real name if senderName is just 'Anonymous'
              otherImage: '', // Receiver might not have sender image in interest doc yet
              profileNo: 'Member'
            });
            seen.add(data.senderId);
          }
        });

        setConnections(connected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [user]);

  // 2. Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat || !user) return;
    
    // Simplistic conversation ID: smallerUid_largerUid
    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    const q = query(
      collection(db, `conversations/${convId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Message));
      setMessages(msgs);
      // Wait for DOM to update then scroll to bottom
      setTimeout(() => {
        const chatBox = document.getElementById('chat-scroll');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedChat, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const convId = [user.uid, selectedChat.otherId].sort().join('_');
    try {
      await addDoc(collection(db, `conversations/${convId}/messages`), {
        text: newMessage,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  if (connections.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <MessageCircle size={32} />
         </div>
         <h3 className="text-2xl font-black text-slate-800">No Conversations Yet</h3>
         <p className="text-slate-500 mt-2">Connecting starts after an Interest is Accepted.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden flex h-[700px]">
      
      {/* Sidebar: Connections */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-black text-slate-900">Connections</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {connections.map(c => (
              <button 
                key={c.otherId}
                onClick={() => setSelectedChat(c)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  selectedChat?.otherId === c.otherId ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                  <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden relative shrink-0">
                     {c.otherImage ? <Image src={c.otherImage} alt={c.otherName} fill className="object-cover" /> : <User className="mx-auto mt-3" size={20} />}
                  </div>
                  <div className="text-left min-w-0">
                     <p className="font-bold truncate">{c.otherName}</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${selectedChat?.otherId === c.otherId ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {c.profileNo}
                     </p>
                  </div>
              </button>
            ))}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex bg-slate-50/30'}`}>
         {selectedChat ? (
            <>
               {/* Chat Header */}
               <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden text-slate-400">
                     <ArrowLeft size={24} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                     {selectedChat.otherImage ? <Image src={selectedChat.otherImage} alt="Chat" fill className="rounded-xl object-cover" /> : selectedChat.otherName.charAt(0)}
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 text-sm leading-none mb-1">{selectedChat.otherName}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online Now</p>
                  </div>
               </div>

               {/* Messages */}
               <div id="chat-scroll" className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 scroll-smooth">
                  {messages.length === 0 && (
                    <div className="text-center py-20 text-slate-400 text-sm italic">
                       No messages yet. Start the conversation!
                    </div>
                  )}
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.uid;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[75%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                            isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                         }`}>
                            {m.text}
                            <div className={`text-[9px] mt-1 opacity-50 text-right`}>
                               {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>

               {/* Input */}
               <form onSubmit={handleSend} className="p-6 border-t border-slate-100 bg-white">
                  <div className="flex gap-3">
                     <input 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Type your message..."
                       className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium h-14"
                     />
                     <button type="submit" className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                        <Send size={24} />
                     </button>
                  </div>
               </form>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-200">
                  <MessageCircle size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Select a connection</h3>
               <p className="text-slate-500 max-w-xs font-medium">To start a chat, choose one of your accepted connections from the list.</p>
            </div>
         )}
      </div>
    </div>
  );
}
