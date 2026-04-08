"use client";

import React from 'react';
import { Printer, Heart } from 'lucide-react';

export default function ProfileActions() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Print Button (Positioned at the top right of the container in the parent) */}
      <div className="flex justify-end mb-4 no-print gap-3">
         <button 
           onClick={handlePrint}
           className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
         >
            <Printer size={18} /> Print / Save as PDF
         </button>
      </div>

      {/* This component will be used to replace the interactive parts of the sidebar too */}
      <div className="pt-4 no-print">
          <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-1">
              Connect Now
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
              Login required to view contact details
          </p>
      </div>
    </>
  );
}

// Separate component for the Favorite button if needed
export function FavoriteButton() {
    return (
        <button 
          onClick={() => alert('Feature coming soon!')}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-all"
        >
            <Heart size={16} />
        </button>
    );
}
