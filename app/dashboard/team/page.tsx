"use client";
import React from 'react';
import { Users, Rocket, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-rose-50 text-rose-600 rounded-3xl mb-4">
           <Users size={64} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our Team</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          We are currently building tools to help you manage your community volunteers and team members. 
          This feature is launching soon!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
         <FeatureItem 
           icon={<Rocket className="text-blue-500" />} 
           label="Multi-Admin Support" 
           desc="Allow multiple people to manage profiles within your community." 
         />
         <FeatureItem 
           icon={<ShieldCheck className="text-emerald-500" />} 
           label="Permission Controls" 
           desc="Carefully control what each team member can see or edit." 
         />
         <FeatureItem 
           icon={<Clock className="text-amber-500" />} 
           label="Activity Tracks" 
           desc="Keep track of changes made by your team members in real-time." 
         />
      </div>

      <div className="pt-12">
         <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-900 text-white rounded-full font-bold shadow-xl shadow-indigo-100">
            <Heart size={20} className="fill-white" /> Coming Soon to TruSathi
         </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
       <div className="mb-4 inline-block">{icon}</div>
       <h3 className="text-lg font-bold text-slate-800 mb-2">{label}</h3>
       <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
