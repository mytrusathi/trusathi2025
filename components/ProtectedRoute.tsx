"use client";
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean; // For Group Admins
  requireSuperAdmin?: boolean; // For Super Admins
  allowedRoles?: string[]; // Flexible role check (Fixes TS Error)
}

const ProtectedRoute = ({ children, requireAdmin, requireSuperAdmin, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Check Specific Flags
      if (requireSuperAdmin && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') {
        router.push('/dashboard/member');
        return;
      }

      // 2. Check Allowed Roles List (if provided)
      // This fixes the error where pages pass allowedRoles=['group-admin']
      if (allowedRoles && allowedRoles.length > 0) {
        // Fallback to '' ensures we pass a string, even if role is undefined
        if (!allowedRoles.includes(user.role || '')) {
          router.push('/dashboard/member');
          return;
        }
      }
    }
  }, [user, loading, router, requireAdmin, requireSuperAdmin, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
           <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
           <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if we are authorized
  if (!user) return null;
  
  // Guard flags for render
  if (requireSuperAdmin && user.role !== 'super-admin') return null;
  if (requireAdmin && user.role !== 'group-admin' && user.role !== 'super-admin') return null;
  
  // Guard allowedRoles for render
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role || '')) return null;

  return <>{children}</>;
};

export default ProtectedRoute;