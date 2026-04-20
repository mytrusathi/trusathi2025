import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import { Sparkles, ShieldCheck, Users, Globe, HandHeart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Success Stories & Our Mission | TruSathi Matrimony",
  description: "Read about our mission to serve mankind through selfless, community-verified matchmaking. Discover the vision behind TruSathi - a 100% free and honest matrimonial service.",
  keywords: ["Success Stories", "Matrimonial Mission", "Trusted Matrimony", "Free Matchmaking", "Human Service"],
};

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="grow">
        {/* Refined Hero with Brand Consistency */}
        <section className="relative bg-background pt-40 pb-52 px-4 overflow-hidden border-b border-border/10">
           {/* Subtler Animated Background Layers */}
           <div className="absolute inset-0 animate-mesh opacity-20 pointer-events-none" />
           <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(circle_at_top,var(--primary)/0.03,transparent_70%)] pointer-events-none animate-pulse duration-[8000ms]" />
           
           {/* Floating Luxury Accents */}
           <div className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] pointer-events-none" />
           
           <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-card/80 border border-border/50 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-sm backdrop-blur-md">
                 <Sparkles size={16} className="text-accent animate-pulse" /> Our Mission & Vision
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85] italic">
                 A Humble Effort to Serve <br className="hidden md:block" /> <span className="text-luxury">Mankind.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto opacity-90 border-l-4 border-primary/20 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                 TruSathi is not a business; it is a service. We are in our starting phase, dedicated to connecting trusted communities without any platform charges.
              </p>
           </div>
        </section>

        {/* The Motto Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-24 pb-20 relative z-20">
           <div className="bg-card rounded-[3.5rem] shadow-premium border border-border/50 p-8 md:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-10">
                    <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary border border-primary/10 shadow-sm animate-bounce duration-[3000ms]">
                       <HandHeart size={36} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.95]">Your Partner to Find Your <span className="text-luxury italic font-serif">TruSathi</span></h2>
                    <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                       Our main motive is to ensure every user finds their life partner in a <strong className="text-foreground underline decoration-accent/30 decoration-4 underline-offset-8">Authenticated and Free</strong> way. 
                       In a world where matchmaking has become a business, TruSathi stands as a beacon of selfless service.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                       <MotiveCard 
                          icon={<ShieldCheck className="text-primary" size={24} />} 
                          title="Free for You" 
                          desc="Users registered directly on TruSathi can access contact details for free-revealed profiles." 
                       />
                       <MotiveCard 
                          icon={<Globe className="text-accent" size={24} />} 
                          title="Authenticated Trust" 
                          desc="Every profile is manually checked and verified by local community group administrators." 
                       />
                    </div>
                 </div>
                 
                 <div className="relative group">
                    <div className="aspect-square bg-muted rounded-[4rem] overflow-hidden shadow-inner flex items-center justify-center text-muted-foreground/20 border border-border/50 group-hover:scale-[1.02] transition-transform duration-700">
                       <Users size={160} strokeWidth={0.5} className="group-hover:text-primary/10 transition-colors" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 bg-card p-10 rounded-[2.5rem] shadow-premium border border-border max-w-[280px] animate-in fade-in slide-in-from-left-8 duration-1000">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Sparkles size={12} className="text-accent" /> Our Goal</p>
                       <p className="text-foreground text-2xl font-black tracking-tight leading-tight">1 Million Trusted Connections by 2026</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Early Stage Message */}
           <div className="mt-20 text-center py-20 px-8 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="max-w-2xl mx-auto space-y-6">
                 <div className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
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

           {/* Call to Action - Standardized */}
           <div className="mt-24 bg-primary rounded-[4rem] p-12 md:p-24 text-center text-white space-y-12 relative overflow-hidden shadow-premium">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter relative z-10 leading-[0.9] italic">Be our first <br/>Success Story.</h2>
              <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto relative z-10 font-medium">
                 Join our mission to keep matchmaking authentic, authenticated, and free for all.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                 <Link href="/register" className="w-full sm:w-auto bg-white text-primary px-12 py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] transition-all hover:bg-accent hover:text-white active:scale-95 shadow-xl">
                    Register Free
                 </Link>
                 <Link href="/search" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-12 py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] backdrop-blur-md border border-white/20 transition-all active:scale-95">
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
      <div className="p-8 bg-muted rounded-[2.5rem] border border-border/50 hover:bg-card hover:shadow-premium transition-all duration-500 group">
         <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">{icon}</div>
         <h4 className="text-foreground text-xl font-black tracking-tight mb-3 italic font-serif">{title}</h4>
         <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest leading-relaxed">{desc}</p>
      </div>
   );
}
