"use client";

import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Handshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChoose from '../components/WhyChoose';
import FeaturedProfiles from '../components/FeaturedProfiles';
import GroupAdminCTA from '../components/GroupAdminCTA';
import Footer from '../components/Footer';

// Features section updated for better Trust and Privacy
const trustSignals = [
  {
    title: 'Privacy-First Approach',
    copy: 'You have full control over your visibility. We ensure your personal data and photos are shared only with those you trust.',
    icon: ShieldCheck,
  },
  {
    title: 'Community Screening',
    copy: 'Each connection sits inside a moderated ecosystem instead of an anonymous swipe feed.',
    icon: Handshake,
  },
  {
    title: 'Direct Trust-Desk',
    copy: 'A direct trust-desk chat gives families a clear place to verify authenticity before moving ahead.',
    icon: MessageSquareText,
  },
];

const journeySteps = [
  'Create a detailed biodata and keep it complete.',
  'Verify phone, email, and a live selfie for trust.',
  'Shortlist profiles and send interests securely.',
  'Connect through our community trust desk when needed.',
];

export default function TrusathiUI() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />

      {/* Trust Highlights Section - Clean & Vibrant */}
      <section className="relative px-4 pb-24 pt-10 md:px-8">
        <div className="mx-auto -mt-20 max-w-7xl rounded-[4rem] border border-border bg-card p-6 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.08)] md:-mt-24 md:p-12 transition-colors">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Main Branding Card - Elegant Red */}
            <div className="rounded-[3rem] bg-gradient-to-br from-primary via-primary/95 to-primary p-10 text-white md:p-16 border border-white/10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(193,18,31,0.3)]">
              {/* Luxury ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-accent-foreground backdrop-blur-md">
                  <CheckCircle2 size={14} className="text-accent" /> Trust-First Matrimony
                </div>

                <h2 className="mt-10 max-w-2xl text-4xl font-black tracking-tighter md:text-7xl leading-[0.95] font-serif">
                  The journey to your Sathi, <br />
                  <span className="text-white/80 italic">guided by Trust.</span>
                </h2>

                <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed opacity-90 md:text-xl">
                  We believe that the search for a life partner deserves a sanctuary of honesty. TruSathi is designed to make every step clear, ensuring your search is private, authenticated, and always respectful.
                </p>

                <div className="mt-14 flex flex-wrap gap-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-primary transition-all hover:bg-accent hover:text-white active:scale-95 shadow-2xl shadow-primary/30"
                  >
                    Start Free <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    See Profiles
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust Signal Cards - Modern & Clean */}
            <div className="grid gap-6">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="rounded-[2.5rem] border border-border bg-card p-10 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/10">
                  <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shadow-sm border border-border">
                    <signal.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{signal.title}</h3>
                  <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">{signal.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyChoose />

      {/* Member Journey Section - Elegant Sober Style */}
      <section className="relative overflow-hidden bg-muted px-4 pt-24 md:pt-40 pb-24 text-foreground md:px-8 border-y border-border">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)/0.03,transparent_50%),radial-gradient(circle_at_bottom_left,var(--primary)/0.02,transparent_40%)] pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl gap-24 lg:grid-cols-[0.85fr_1.15fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-sm">
              <Camera size={14} /> The Journey Together
            </div>
            <h2 className="mt-10 text-5xl font-black tracking-tighter md:text-8xl leading-[0.9] font-serif">
              Simple. True. <br /> <span className="text-primary italic underline decoration-primary/20 decoration-8 underline-offset-8">Transparent.</span>
            </h2>
            <p className="mt-12 max-w-xl text-xl font-medium leading-relaxed opacity-80 text-muted-foreground">
              Your search for a life partner deserves a path that is easy to trust. From direct community support to authenticated profiles, we&apos;ve removed the noise so you can focus on what&apos;s real.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {journeySteps.map((step, index) => (
              <div key={step} className="group rounded-[3rem] border border-border bg-card p-12 hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-2 border-l-4 border-l-primary/30">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">Protocol 0{index + 1}</p>
                <p className="mt-6 text-2xl font-black leading-tight group-hover:text-primary transition-colors tracking-tight text-foreground">{step}</p>
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