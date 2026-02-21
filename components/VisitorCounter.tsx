'use client';
import { useEffect, useState } from 'react';
import { rtdb } from '@/app/lib/firebase';
import { ref, onValue, runTransaction } from 'firebase/database';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const countRef = ref(rtdb, 'stats/visitors');

    // Increment count once per session
    if (!sessionStorage.getItem('counted')) {
      runTransaction(countRef, (current) => (current || 0) + 1);
      sessionStorage.setItem('counted', 'true');
    }

    // Subscribe to live updates
    return onValue(countRef, (snapshot) => {
      setCount(snapshot.val());
    });
  }, []);

  if (count === null) return null;

  return (
    <div className="text-xs text-gray-400">
      Visitors: <span className="font-mono">{count}</span>
    </div>
  );
}