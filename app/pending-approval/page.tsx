'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function PendingApprovalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role === 'group-admin' && user.isApproved !== false) {
        router.replace('/dashboard/group-admin');
      } else if (user.role !== 'group-admin') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

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
