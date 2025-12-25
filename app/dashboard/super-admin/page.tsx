"use client";
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, 
  Shield, 
  Search, 
  Loader2, 
  LogOut, 
  KeyRound, 
  LayoutDashboard, 
  FileText,
  Menu,
  X,
  ChevronDown,
  CheckCircle,
  AlertTriangle
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
}

const SuperAdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  
  // Data State
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    groupAdmins: 0
  });

  useEffect(() => {
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
          const creatorId = data.createdBy;
          if (creatorId) {
            profileCounts[creatorId] = (profileCounts[creatorId] || 0) + 1;
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
            profileCount: profileCounts[docSnap.id] || 0
          });
        });

        setUsers(fetchedUsers);
        setStats({
          totalUsers: usersSnap.size,
          totalProfiles: profilesSnap.size,
          groupAdmins: fetchedUsers.filter(u => u.role === 'group-admin').length
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: 'error', text: "Failed to load dashboard data." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setMessage({ type: 'success', text: `Password reset email sent to ${currentUser.email}` });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const filteredUsers = users.filter(u => 
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (u.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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
              <LayoutDashboard size={20} />
              Overview
            </div>
            {/* Add more nav items here if needed later */}
          </nav>

          <div className="p-4 border-t border-slate-100">
             <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="font-bold text-xs">{currentUser?.displayName?.charAt(0) || 'A'}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{currentUser?.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">Super Admin</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
             <h2 className="font-semibold text-lg text-slate-800 hidden md:block">Dashboard Overview</h2>
             <div className="md:hidden flex items-center gap-2">
                 <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold">t</div>
             </div>

             <div className="flex items-center gap-4">
                <button 
                  onClick={handlePasswordReset}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                  title="Send Password Reset Email"
                >
                    <KeyRound size={18} />
                    <span className="hidden sm:inline">Reset Password</span>
                </button>
                
                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
             </div>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            
            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard 
                    label="Total Users" 
                    value={stats.totalUsers} 
                    icon={<Users className="text-blue-600" size={24} />} 
                    bg="bg-blue-50" 
                />
                <StatCard 
                    label="Group Admins" 
                    value={stats.groupAdmins} 
                    icon={<Shield className="text-purple-600" size={24} />} 
                    bg="bg-purple-50" 
                />
                <StatCard 
                    label="Total Profiles" 
                    value={stats.totalProfiles} 
                    icon={<FileText className="text-rose-600" size={24} />} 
                    bg="bg-rose-50" 
                />
            </div>

            {/* Main Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">User Management</h3>
                        <p className="text-sm text-slate-500">Monitor users and their contributions</p>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 w-full sm:w-72 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Profiles Added</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-rose-500" size={32} />
                                            <p className="text-slate-500 font-medium">Loading platform data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.uid} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    {user.displayName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{user.displayName || "Unknown Name"}</p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'group-admin' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800 text-lg">{user.profileCount}</span>
                                                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Profiles</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
                    Showing {filteredUsers.length} of {users.length} total users
                </div>
            </div>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Helper Components
const StatCard = ({ label, value, icon, bg }: { label: string, value: number, icon: React.ReactNode, bg: string }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-xl ${bg}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
        case 'super-admin':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-100 border border-slate-700">Super Admin</span>;
        case 'group-admin':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">Group Admin</span>;
        default:
            return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">Member</span>;
    }
};

export default SuperAdminDashboard;