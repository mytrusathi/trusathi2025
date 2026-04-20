// app/terms/page.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Shield, AlertTriangle, Sparkles, HeartHandshake, ShieldCheck, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: "The Community Charter | Authentic Connections",
  description: "Read the TruSathi Community Charter — our commitment to trust, authenticity, and serving mankind through verified matchmaking. Understand our decentralized trust model and safety guidelines.",
  keywords: ["Community Charter", "Matrimonial Rules", "Trusted Matchmaking", "Platform Integrity", "Safety Guidelines"],
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative bg-background pt-32 pb-24 px-4 overflow-hidden border-b border-border/10">
        {/* Subtle Animated Background Layers */}
        <div className="absolute inset-0 animate-mesh opacity-10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(circle_at_top,var(--primary)/0.03,transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
               <ShieldCheck size={14} className="animate-pulse" /> Platform Integrity
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-tight italic">
              The Community <br className="hidden md:block" /> <span className="text-luxury">Charter.</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              At TruSathi, we are a mission-driven service helping you find a life partner through trust and community screening. This charter defines our collective commitment.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] justify-center md:justify-start opacity-70">
              <span className="flex items-center gap-2 decoration-primary/20 underline underline-offset-8 decoration-2"><Scale size={14} /> Legally Neutral</span>
              <span className="flex items-center gap-2 decoration-primary/20 underline underline-offset-8 decoration-2"><Shield size={14} /> Authenticity First</span>
              <span className="flex items-center gap-2 decoration-primary/20 underline underline-offset-8 decoration-2"><Sparkles size={14} /> Last Updated: April 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20 text-foreground/80 leading-relaxed font-medium">
          
          {/* Section 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                  <HeartHandshake size={24} strokeWidth={1.5} />
               </div>
               <h2 className="text-3xl font-black text-foreground tracking-tight">1. Our Humble Mission</h2>
            </div>
            <div className="pl-16 space-y-4">
               <p>
                 Welcome to <strong>TruSathi</strong>. We are a community-verified matrimony platform designed to connect individuals for building sacred lifelong bonds through trusted community leaders.
               </p>
               <p className="bg-muted p-6 rounded-[2rem] border border-border italic text-muted-foreground">
                 "By entering TruSathi, you agree to be part of a decentralized trust network where authenticity is valued above all else."
               </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                  <ShieldCheck size={24} strokeWidth={1.5} />
               </div>
               <h2 className="text-3xl font-black text-foreground tracking-tight">2. Decentralized Trust</h2>
            </div>
            <div className="pl-16 space-y-6">
               <p>
                 TruSathi operates on a unique decentralized model. By using this service, you acknowledge that:
               </p>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Admin Role</span>
                     <p className="text-sm">Group Admins are responsible for screening the authenticity of the profiles in their community groups.</p>
                  </li>
                  <li className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Trust Layer</span>
                     <p className="text-sm">The primary trust resides with the Community Leader. Join groups administered by people you trust.</p>
                  </li>
               </ul>
            </div>
          </section>

          {/* Section 7 — REDESIGNED Limitation of Liability */}
          <section className="bg-primary/5 border border-primary/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex items-start gap-6 mb-10 relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                <AlertTriangle className="text-primary" size={32} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">3. Limitation of Liability</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Boundaries of our legal responsibility.</p>
              </div>
            </div>

            <div className="space-y-8 text-foreground/70 relative z-10 text-lg">
              <p>
                <strong>3.1 Intermediary Service:</strong> TruSathi acts solely as a technology facilitator. We are NOT a matchmaking agency or a background verification company.
              </p>
              <p>
                <strong>3.2 User Due Diligence:</strong> <strong>Your safety is your own responsibility.</strong> You must conduct your own independent checks before proceeding with any match. Consult family and meet in safe public places.
              </p>
              <p>
                <strong>3.3 Cap on Liability:</strong> Our aggregate liability to you for any claim shall not exceed INR 500.
              </p>
              
              <div className="pt-8 border-t border-primary/10">
                 <p className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <ShieldCheck size={16} /> Acceptance of Terms
                 </p>
                 <p className="text-sm italic mt-2">
                    By using TruSathi, you explicitly acknowledge and agree to this Charter. If you do not agree, please cease using the Platform immediately.
                 </p>
              </div>
            </div>
          </section>

          {/* Section 9 — Authenticity Score Disclaimer */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                  <Sparkles size={24} strokeWidth={1.5} />
               </div>
               <h2 className="text-3xl font-black text-foreground tracking-tight">4. Authenticity Score Disclaimer</h2>
            </div>
            
            <div className="pl-16 space-y-6">
               <p>
                 The "Authenticity Score" reflects the <strong>degree of information completeness</strong> of a profile. It is NOT a character certificate or a police screening.
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ScoreBadge label="ID Verified" pts="20" />
                  <ProfilePts label="Completeness" pts="20" />
                  <ProfilePts label="Photo" pts="30" />
                  <ProfilePts label="Admin Approval" pts="30" />
               </div>

               <div className="bg-background border border-border p-8 rounded-[2.5rem] shadow-premium">
                  <p className="text-sm font-bold text-foreground leading-relaxed">
                    🔔 <strong>Important:</strong> A score of 100 does not guarantee trustworthiness. It simple means the user has provided all requested authentication signals to our satisfaction.
                  </p>
               </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-1 text-center md:text-left">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Have Questions?</p>
               <a href="mailto:legal@trusathi.com" className="text-2xl font-black text-primary hover:text-primary/80 transition-all underline decoration-primary/20 underline-offset-8">
                 legal@trusathi.com
               </a>
            </div>
            <div className="text-center md:text-right">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Connect with Purpose</p>
               <p className="text-xs font-bold text-foreground">© 2026 TruSathi. Integrity First.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfilePts({ label, pts }: { label: string; pts: string }) {
   return (
      <div className="flex flex-col items-center gap-2 p-6 bg-muted rounded-3xl border border-border transition-all hover:bg-card">
         <span className="text-xl font-black text-primary">+{pts}</span>
         <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center">{label}</span>
      </div>
   );
}

function ScoreBadge({ label, pts }: { label: string; pts: string }) {
   return (
      <div className="flex flex-col items-center gap-2 p-6 bg-primary/5 rounded-3xl border border-primary/20 shadow-sm transition-all hover:scale-105">
         <span className="text-xl font-black text-primary">+{pts}</span>
         <span className="text-[8px] font-black text-primary uppercase tracking-widest text-center">{label}</span>
      </div>
   );
}