// app/register/pending/page.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Clock, ShieldCheck, Mail } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          
          {/* Icon Animation */}
          <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Clock className="text-amber-600" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Verification Pending
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Thank you for registering as a Group Admin. Your account is currently under review by our Trust & Safety team.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-600" />
              What happens next?
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                We verify your identity to ensure the safety of the community.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                You will receive an email once your account is approved.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                Once approved, you can start creating profiles and managing your group.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
             <div className="text-sm text-slate-500 flex items-center justify-center gap-2">
                <Mail size={16} />
                <span>
                  Please 
                  {/* UPDATED: Support Email Link */}
                  <a href="mailto:support@trusathi.com" className="mx-1 text-indigo-600 font-medium hover:underline">
                    contact support
                  </a> 
                  if this takes longer than 24 hours.
                </span>
             </div>
             
             <Link 
               href="/"
               className="mt-4 text-indigo-600 font-semibold hover:underline"
             >
               Return to Home
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}