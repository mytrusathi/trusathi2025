import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Heart, Star, Sparkles, ShieldCheck, Users, Globe, HandHeart } from 'lucide-react';
import Link from 'next/link';

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-indigo-900 pt-20 pb-32 px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20">
                 <Sparkles size={16} className="text-amber-400" /> Our Mission & Vision
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
                 A Humble Effort to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Serve Mankind</span>.
              </h1>
              <p className="text-indigo-100/80 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                 TruSathi is not a business; it is a service. We are in our starting phase, dedicated to connecting trusted communities without any platform charges.
              </p>
           </div>
        </section>

        {/* The Motto Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20 relative z-20">
           <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 md:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                       <HandHeart size={32} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Your Partner to Find Your <span className="text-indigo-600">TruSathi</span></h2>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                       Our main motive is to ensure every user finds their life partner in a <strong>Verified and Free</strong> way. 
                       In a world where matchmaking has become a business, TruSathi stands as a beacon of selfless service.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                       <MotiveCard 
                          icon={<ShieldCheck className="text-indigo-500" />} 
                          title="Free for You" 
                          desc="Users registered directly on TruSathi can access contact details for free-revealed profiles." 
                       />
                       <MotiveCard 
                          icon={<Globe className="text-emerald-500" />} 
                          title="Verified Trust" 
                          desc="Every profile is manually checked and verified by local community group administrators." 
                       />
                    </div>
                 </div>
                 
                 <div className="relative">
                    <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner flex items-center justify-center text-slate-300">
                       <Users size={120} strokeWidth={1} />
                       {/* You can replace this with a real community image later */}
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-indigo-50 max-w-[200px]">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Our Goal</p>
                       <p className="text-slate-800 font-bold leading-tight">1 Million Trusted Connections by 2026</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Early Stage Message */}
           <div className="mt-20 text-center py-20 px-8 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="max-w-2xl mx-auto space-y-6">
                 <div className="inline-flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                    <Sparkles size={20} /> Starting Our Journey
                 </div>
                 <h2 className="text-3xl font-black text-slate-900">Success Stories Coming Soon!</h2>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    We have just begun our effort to serve mankind. 
                    While our first matches are currently in the making, our real success is the trust your community puts in us every day. 
                    <strong>Check back soon for the stories of TruSathi couples!</strong>
                 </p>
              </div>
           </div>

           {/* Call to Action */}
           <div className="mt-20 bg-indigo-950 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-10 relative overflow-hidden shadow-3xl shadow-indigo-100">
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="text-4xl md:text-6xl font-black tracking-tight relative z-10 leading-none">Be our first <br/>Success Story.</h2>
              <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto relative z-10 font-medium">
                 Join our mission to keep matchmaking authentic, verified, and free for all.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                 <Link href="/register" className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-rose-900/30 transform hover:-translate-y-1">
                    Register Free
                 </Link>
                 <Link href="/search" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-12 py-5 rounded-2xl font-black text-xl backdrop-blur-md border border-white/20 transition-all transform hover:-translate-y-1">
                    Browse Matches
                 </Link>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MotiveCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
   return (
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors">
         <div className="mb-4">{icon}</div>
         <h4 className="text-slate-900 font-black mb-2">{title}</h4>
         <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
      </div>
   );
}
