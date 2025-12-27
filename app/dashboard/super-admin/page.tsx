"use client";
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, Shield, Search, Loader2, LogOut, KeyRound, 
  LayoutDashboard, FileText, CheckCircle, AlertTriangle, XCircle, ShieldAlert 
} from 'lucide-react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface DashboardUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super-admin' | 'group-admin' | 'member';
  createdAt?: string;
  profileCount?: number;
  isApproved?: boolean; // Added this field
}

const SuperAdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  
  // Data State
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Computed Stats
  const stats = {
    totalUsers: users.length,
    totalProfiles: users.reduce((acc, user) => acc + (user.profileCount || 0), 0),
    groupAdmins: users.filter(u => u.role === 'group-admin').length,
    pendingApprovals: users.filter(u => u.role === 'group-admin' && u.isApproved === false).length
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Users
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      
      // 2. Fetch Profiles (to count them)
      const profilesRef = collection(db, 'profiles');
      const profilesSnap = await getDocs(profilesRef);
      
      // Count profiles per creator
      const profileCounts: Record<string, number> = {};
      profilesSnap.forEach(doc => {
        const data = doc.data();
        if (data.createdBy) {
          profileCounts[data.createdBy] = (profileCounts[data.createdBy] || 0) + 1;
        }
      });

      const fetchedUsers: DashboardUser[] = [];
      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedUsers.push({
          uid: docSnap.id,
          email: data.email || 'No Email',
          displayName: data.displayName || 'Unnamed User',
          role: data.role || 'member',
          createdAt: data.createdAt,
          isApproved: data.isApproved, // Capture approval status
          profileCount: profileCounts[docSnap.id] || 0
        });
      });

      setUsers(fetchedUsers);

    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: 'error', text: "Failed to load dashboard data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTIONS ---

  const handleApprove = async (uid: string) => {
    if(!confirm("Approve this Group Admin?")) return;
    try {
      await updateDoc(doc(db, 'users', uid), { isApproved: true });
      setMessage({ type: 'success', text: "User approved successfully" });
      fetchData(); // Refresh list
    } catch (error) {
      setMessage({ type: 'error', text: "Failed to approve user" });
    }
  };

  const handleReject = async (uid: string) => {
    if(!confirm("Reject this user? They will remain in pending state.")) return;
    // For now, we just leave them as isApproved: false, or you could add a 'banned' field.
    setMessage({ type: 'success', text: "Action recorded." });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Force a full page reload to clear browser memory/cache
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed", error);
    }
};

  const filteredUsers = users.filter(u => 
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (u.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const pendingUsers = users.filter(u => u.role === 'group-admin' && u.isApproved === false);

  return (
    <ProtectedRoute requireSuperAdmin>
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold">t</div>
            <span className="font-bold text-xl text-slate-800">tru<span className="text-rose-600">Sathi</span></span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-xl font-medium">
              <LayoutDashboard size={20} /> Overview
            </div>
          </nav>
          <div className="p-4 border-t border-slate-100">
             <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="font-bold text-xs">{currentUser?.displayName?.charAt(0) || 'A'}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900">{currentUser?.displayName}</p>
                    <p className="text-xs text-slate-500">Super Admin</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
             <h2 className="font-semibold text-lg text-slate-800">Dashboard</h2>
             <button onClick={handleLogout} className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-2">
                <LogOut size={18} /> Logout
             </button>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-600" />} bg="bg-blue-50" />
                <StatCard label="Group Admins" value={stats.groupAdmins} icon={<Shield className="text-purple-600" />} bg="bg-purple-50" />
                <StatCard label="Profiles" value={stats.totalProfiles} icon={<FileText className="text-rose-600" />} bg="bg-rose-50" />
                <StatCard label="Pending" value={stats.pendingApprovals} icon={<ShieldAlert className="text-amber-600" />} bg="bg-amber-50" />
            </div>

            {/* 🚨 PENDING APPROVALS SECTION (Only shows if there are pending users) */}
            {pendingUsers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
                   <ShieldAlert className="text-amber-600" size={20} />
                   <h3 className="font-bold text-amber-900">Pending Approvals Needed</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-amber-50/50 text-amber-800 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Registered</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {pendingUsers.map(user => (
                            <tr key={user.uid}>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{user.displayName}</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    <button onClick={() => handleReject(user.uid)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1">
                                        <XCircle size={16}/> Reject
                                    </button>
                                    <button onClick={() => handleApprove(user.uid)} className="px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center gap-1 shadow-sm">
                                        <CheckCircle size={16}/> Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* All Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="font-bold text-slate-800">All Users</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="text" 
                           placeholder="Search users..." 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Profiles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user.uid} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{user.displayName}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'super-admin' ? 'bg-slate-800 text-white' : user.role === 'group-admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isApproved === false && user.role === 'group-admin' ? (
                                            <span className="text-amber-600 font-bold text-xs flex items-center gap-1"><ShieldAlert size={12}/> Pending</span>
                                        ) : (
                                            <span className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle size={12}/> Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{user.profileCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const StatCard = ({ label, value, icon, bg }: any) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default SuperAdminDashboard;