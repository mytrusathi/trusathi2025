"use client";
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean; 
  requireSuperAdmin?: boolean; 
  allowedRoles?: string[]; 
}

const ProtectedRoute = ({ children, requireAdmin, requireSuperAdmin, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 1. Not Logged In? -> REPLACE history so they can't click "Back" to here.
      if (!user) {
        router.replace('/login'); 
        return;
      }

      // 2. Pending Approval Check (CRITICAL FIX)
      // If a group admin is NOT approved, they shouldn't see the dashboard.
      if (user.role === 'group-admin' && user.isApproved === false) {
         // Optionally send them to a "Pending" page, or just keep them away
         // For now, we just don't let them proceed.
      }

      // 3. Check Specific Flags (Use 'push' here as it's a valid navigation within the app)
      if (requireSuperAdmin && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      // 4. Check Allowed Roles List
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role || '')) {
          router.push('/dashboard/member');
          return;
        }
      }
    }
  }, [user, loading, router, requireAdmin, requireSuperAdmin, allowedRoles]);

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
           <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
           <p className="text-slate-500 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If no user, render NOTHING while the useEffect redirects.
  // This prevents the "Incomplete Dashboard" flash.
  if (!user) return null;
  
  // Guard for Pending Admins
  if (user.role === 'group-admin' && user.isApproved === false) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-200 text-center max-w-md">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="animate-spin" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Account Pending</h2>
                <p className="text-slate-600 mb-6">
                    Your Group Admin account is waiting for Super Admin approval. 
                    <br/>Please check back later.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="text-rose-600 font-bold hover:underline"
                >
                    Back to Home
                </button>
            </div>
        </div>
     );
  }
  
  // Strict Render Guards (Double check to be safe)
  if (requireSuperAdmin && user.role !== 'super-admin') return null;
  if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') return null;
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role || '')) return null;

  return <>{children}</>;
};

export default ProtectedRoute;