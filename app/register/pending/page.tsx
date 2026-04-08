"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PendingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/pending-approval');
  }, [router]);

  return <div className="min-h-screen bg-slate-50" />;
}