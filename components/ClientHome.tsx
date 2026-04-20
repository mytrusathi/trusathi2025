"use client";

import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ShieldCheck,
  MessageSquareText,
  Handshake,
  ChevronRight
} from 'lucide-react';
import Navbar from './Navbar';
import Hero from './Hero';
import WhyChoose from './WhyChoose';
import FeaturedProfiles from './FeaturedProfiles';
import GroupAdminCTA from './GroupAdminCTA';
import Footer from './Footer';

// Features section updated for better Trust and Privacy
const trustSignals = [
  {
    title: 'Privacy by Choice',
    copy: 'Manage your digital presence with ease. You have full control over who accesses your personal information.',
    icon: ShieldCheck,
  },
  {
    title: 'Moderated Network',
    copy: 'We move away from anonymous culture by maintaining a community-focused platform for serious matchmaking.',
    icon: Handshake,
  },
  {
    title: 'Assisted Verification',
    copy: 'A dedicated desk to help you navigate the platform and connect with verified-intent members.',
    icon: MessageSquareText,
  },
];

const journeySteps = [
  "Create Profile",
  "Get Verified",
  "Discover Matches",
  "Start Connecting"
];

export default function ClientHome() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 view-transition">
      <Navbar />
      <Hero />

      {/* Trust Highlights Section */}
      <section id="trust" className="relative px-4 pb-20 pt-16 md:px-8 bg-background scroll-mt-32">
        <div className="mx-auto -mt-16 max-w-6xl rounded-[3rem] border border-border/50 bg-card p-6 shadow-premium md:-mt-24 md:p-12 relative overflow-hidden">

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">

            {/* Main Branding Card */}
            <div className="rounded-[2.5rem] bg-primary p-8 text-white md:p-14 relative overflow-hidden shadow-lg border border-white/5 group">

              <div className="relative z-10">
                {/* Badge: Simple and Clear */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md mb-6">
                  <CheckCircle2 size={14} className="text-accent" /> Community Verified Portal
                </div>

                {/* Heading: Size reduced from 5.5rem to 3.5rem/4rem for better fit */}
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  The Journey to <br />
                  <span className="text-white underline decoration-accent/30 decoration-4 underline-offset-4">Your True Sathi</span>, <br />
                  <span className="text-white/70 italic font-serif">Simplified by Trust.</span>
                </h2>

                {/* Body Text: Removed "Sacred/Sanctuary" for liability/simplicity */}
                <p className="max-w-lg text-base md:text-lg font-medium leading-relaxed opacity-90 mb-10">
                  A secure space where every profile is hand-reviewed. TruSathi brings the reliability of community circles to your fingertips, keeping your privacy first.
                </p>

                {/* Buttons: Clean and Action-Oriented */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-accent hover:text-white active:scale-95 shadow-md"
                  >
                    Start Your Search <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95 backdrop-blur-sm"
                  >
                    Browse Profiles
                  </Link>
                </div>
              </div>
            </div>


            {/* Trust Signal Cards - Compact & Clean */}
            <div className="grid gap-4 md:gap-6">
              {trustSignals.map((signal, idx) => (
                <div
                  key={signal.title}
                  className="p-6 rounded-3xl border border-border/40 bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-8"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    {/* Icon: Size reduced from h-16/w-16 to h-12/w-12 */}
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary shadow-sm border border-border/20">
                      <signal.icon size={22} />
                    </div>

                    <div>
                      {/* Title: Reduced from 3xl to text-lg/xl and removed italic/serif for better readability */}
                      <h3 className="text-lg font-bold text-foreground tracking-tight leading-tight mb-1">
                        {signal.title}
                      </h3>
                      {/* Copy: Slightly smaller text for better hierarchy */}
                      <p className="text-sm font-medium leading-normal text-muted-foreground">
                        {signal.copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyChoose />

      {/* Member Journey Section - Modern & Clean */}
      <section id="journey" className="relative overflow-hidden bg-secondary px-6 py-10 md:py-20 text-foreground border-y border-border/30 scroll-mt-0">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)/0.03,transparent_50%)] pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">

          {/* Left Side: Content */}
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-background border border-border/40 text-primary text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Camera size={14} className="text-accent" /> The Simple Process
            </div>

            {/* Reduced from 8rem to 4xl/6xl */}
            <h2 className="mt-8 text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Honest. <br /> Elegant. <br />
              <span className="text-primary underline decoration-primary/10 underline-offset-8">Reliable.</span>
            </h2>

            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground border-l-4 border-primary/20 pl-6">
              We’ve simplified the search for a life partner into a peaceful, transparent experience. No clutter, just genuine community connections.
            </p>
          </div>

          {/* Right Side: Step Cards (Fixed Padding and Text) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {journeySteps.map((step, index) => (
              <div
                key={step}
                className="p-8 rounded-3xl bg-background border border-border/50 group hover:shadow-xl hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Step 0{index + 1}</p>
                  <div className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                </div>

                {/* Title: Reduced from 3xl to xl/2xl to prevent overflow */}
                <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProfiles />
      <GroupAdminCTA />
      <Footer />
    </div>
  );
}
