"use client";
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean; 
  requireSuperAdmin?: boolean; 
  allowedRoles?: ('super-admin' | 'group-admin' | 'member')[]; 
}

type UserRole = NonNullable<Props['allowedRoles']>[number];

const ProtectedRoute = ({ children, requireAdmin, requireSuperAdmin, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const currentRole = user?.role;
  const hasAllowedRole = !allowedRoles || allowedRoles.length === 0
    ? true
    : (currentRole !== undefined && allowedRoles.includes(currentRole as UserRole));

  useEffect(() => {
    if (!loading) {
      // 1. Not Logged In?
      if (!user) {
        router.replace('/login'); 
        return;
      }

      // 2. Guard for Pending Admins
      if (user.role === 'group-admin' && user.isApproved === false) {
         router.replace('/pending-approval');
         return;
      }

      // 3. Check Specific Flags
      if (requireSuperAdmin && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      // 4. Check Allowed Roles List
      if (!hasAllowedRole) {
        router.push('/dashboard/member');
        return;
      }
    }
  }, [user, loading, router, requireAdmin, requireSuperAdmin, hasAllowedRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
           <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
           <p className="text-slate-500 text-sm font-medium">Authenticating access...</p>
        </div>
      </div>
    );
  }

  // Prevents the "Incomplete Dashboard" flash while redirecting.
  if (!user) return null;
  
  if (user.role === 'group-admin' && user.isApproved === false) {
     return null; // The useEffect redirect to /pending-approval takes care of this
  }
  
  // Strict Render Guards
  if (requireSuperAdmin && user.role !== 'super-admin') return null;
  if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') return null;
  if (!hasAllowedRole) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
