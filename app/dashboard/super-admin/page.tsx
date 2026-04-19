"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, getCountFromServer, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, Shield, Search, LogOut, 
  LayoutDashboard, FileText, CheckCircle, AlertTriangle, ShieldAlert, Home 
} from 'lucide-react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

interface DashboardUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super-admin' | 'group-admin' | 'member';
  createdAt?: string;
  profileCount?: number;
  isApproved?: boolean;
}

const SuperAdminDashboard = () => {
  // Data State
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Computed Stats
  const stats = {
    totalUsers: users.length,
    totalProfiles: users.reduce((acc, user) => acc + (user.profileCount || 0), 0),
    groupAdmins: users.filter(u => u.role === 'group-admin').length,
    pendingApprovals: users.filter(u => u.role === 'group-admin' && u.isApproved === false).length
  };

  const fetchData = useCallback(async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      
      const fetchedUsers: DashboardUser[] = [];
      
      await Promise.all(usersSnap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let pCount = 0;
        try {
           const coll = collection(db, 'profiles');
           const countQuery = query(coll, where('createdBy', '==', docSnap.id));
           const snapCount = await getCountFromServer(countQuery);
           pCount = snapCount.data().count;
        } catch (e) { console.error(e) }

        fetchedUsers.push({
          uid: docSnap.id,
          email: data.email || 'No Email',
          displayName: data.displayName || 'Unnamed User',
          role: data.role || 'member',
          createdAt: data.createdAt,
          isApproved: data.isApproved,
          profileCount: pCount
        });
      }));

      setUsers(fetchedUsers);

    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: 'error', text: "Failed to load dashboard data." });
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleApprove = async (uid: string) => {
    if(!confirm("Approve this Group Admin?")) return;
    try {
      await updateDoc(doc(db, 'users', uid), { isApproved: true });
      setMessage({ type: 'success', text: "User approved successfully" });
      fetchData();
    } catch (error) {
      console.error("Approve failed", error);
      setMessage({ type: 'error', text: "Failed to approve user" });
    }
  };

  const handleReject = async () => {
    if(!confirm("Reject this user? They will remain in pending state.")) return;
    setMessage({ type: 'success', text: "Action recorded." });
  };

  const filteredUsers = users.filter(u => 
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (u.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const pendingUsers = users.filter(u => u.role === 'group-admin' && u.isApproved === false);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {message && (
          <div className={`p-6 rounded-[2.5rem] flex items-center gap-4 shadow-xl ${message.type === 'success' ? 'bg-primary text-white' : 'bg-destructive text-white'}`}>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <span className="font-black text-xs uppercase tracking-widest">{message.text}</span>
          </div>
      )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Ecosystem Users" value={stats.totalUsers} icon={<Users size={22} />} theme="indigo" />
                  <StatCard label="Certified Admins" value={stats.groupAdmins} icon={<Shield size={22} />} theme="emerald" />
                  <StatCard label="Live Bio-Data" value={stats.totalProfiles} icon={<FileText size={22} />} theme="rose" />
                  <StatCard label="Awaiting Approval" value={stats.pendingApprovals} icon={<ShieldAlert size={22} />} theme="amber" />
              </div>

              {/* 🚨 PENDING APPROVALS SECTION */}
              {pendingUsers.length > 0 && (
                <section className="bg-card rounded-[3.5rem] shadow-premium border border-border overflow-hidden">
                  <div className="p-8 border-b border-border/50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary border border-primary/10">
                           <ShieldAlert size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Access Requests</h3>
                           <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Verification Required</p>
                        </div>
                     </div>
                     <div className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-widest animate-pulse">
                        High Priority
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <tbody className="divide-y divide-border/30">
                          {pendingUsers.map(user => (
                              <tr key={user.uid} className="hover:bg-secondary/50 transition-colors">
                                  <td className="px-8 py-8">
                                      <div className="flex items-center gap-5">
                                         <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center font-black text-muted-foreground border border-border">
                                            {user.displayName.charAt(0)}
                                         </div>
                                         <div className="min-w-0">
                                            <p className="font-black text-foreground text-sm uppercase tracking-tight truncate">{user.displayName}</p>
                                            <p className="text-[11px] text-muted-foreground font-medium truncate">{user.email}</p>
                                         </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-8 text-right flex justify-end gap-3">
                                      <button onClick={handleReject} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive transition-all">
                                          Reject
                                      </button>
                                      <button onClick={() => handleApprove(user.uid)} className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lift hover:bg-primary/90 transition-all active:scale-95">
                                          Approve Credentials
                                      </button>
                                  </td>
                               </tr>
                          ))}
                        </tbody>
                     </table>
                  </div>
                </section>
              )}

              {/* All Users Table */}
              <section className="bg-card rounded-[3.5rem] shadow-premium border border-border overflow-hidden pb-10">
                  <div className="p-10 border-b border-border/50 flex justify-between items-center gap-6 flex-wrap">
                      <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Identity Audit</h3>
                      <div className="relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                           <input 
                              type="text" 
                              placeholder="Search ecosystem..." 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-14 pr-8 py-5 bg-secondary border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-[2.5rem] focus:outline-none transition-all w-full md:w-80 font-black text-[10px] uppercase tracking-widest shadow-inner placeholder:text-muted-foreground"
                           />
                      </div>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-secondary/50 text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em]">
                              <tr>
                                  <th className="px-10 py-6">Identity Profile</th>
                                  <th className="px-10 py-6">Role / Access</th>
                                  <th className="px-10 py-6">Security State</th>
                                  <th className="px-10 py-6 text-center">Bio-Assets</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                              {filteredUsers.map(user => (
                                  <tr key={user.uid} className="hover:bg-secondary/50 transition-colors">
                                      <td className="px-10 py-8">
                                          <p className="font-black text-foreground text-[13px] uppercase tracking-tight">{user.displayName}</p>
                                          <p className="text-[11px] text-muted-foreground font-medium">{user.email}</p>
                                      </td>
                                      <td className="px-10 py-8">
                                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            user.role === 'super-admin' ? 'bg-foreground border-foreground text-background shadow-lg' : 
                                            user.role === 'group-admin' ? 'bg-primary/5 border-primary/10 text-primary' : 
                                            'bg-secondary border-border text-muted-foreground'
                                          }`}>
                                              {user.role}
                                          </span>
                                      </td>
                                      <td className="px-10 py-8">
                                          <div className="flex items-center gap-2">
                                              <div className={`w-2 h-2 rounded-full ${user.isApproved === false && user.role === 'group-admin' ? 'bg-accent animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}></div>
                                              <span className={`text-[10px] font-black uppercase tracking-widest ${user.isApproved === false && user.role === 'group-admin' ? 'text-accent' : 'text-emerald-700'}`}>
                                                 {user.isApproved === false && user.role === 'group-admin' ? 'Verification Required' : 'Operational'}
                                              </span>
                                          </div>
                                      </td>
                                      <td className="px-10 py-8 text-center text-xs font-black text-foreground">
                                         {user.profileCount}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </section>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  theme,
}: {
  label: string
  value: number
  icon: React.ReactNode
  theme: 'indigo' | 'emerald' | 'rose' | 'amber'
}) => {
  const themes = {
    indigo: 'bg-primary/5 text-primary border-primary/10 shadow-primary/5',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50',
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-500">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl ${themes[theme]}`}>
           {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    </div>
  );
};

export default SuperAdminDashboard;
