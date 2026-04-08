'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
          <p className="text-slate-500">
            We encountered an unexpected error while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors block text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
