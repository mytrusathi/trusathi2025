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
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Trust Highlights Section */}
      <section className="relative bg-[#fcfbf7] px-4 pb-24 pt-10 md:px-8">
        <div className="mx-auto -mt-12 max-w-7xl rounded-[2.5rem] border border-[#e7e2d8] bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)] backdrop-blur-xl md:-mt-40 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Main Branding Card - Navy/Gold Gradient */}
            <div className="rounded-[2.5rem] bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#1e293b_100%)] p-8 text-white md:p-12 border border-white/5 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                  <CheckCircle2 size={14} /> Trust-First Companion
                </div>

                {/* Updated Legally Safe and Emotional Heading */}
                <h2 className="mt-8 max-w-2xl text-3xl font-black tracking-tight md:text-5xl leading-[1.1]">
                  The journey to your Sathi, <br />
                  <span className="text-amber-500 italic font-serif">guided by Trust.</span>
                </h2>

                <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-slate-400 md:text-base">
                  We believe that the journey to a life partner deserves a path guided by honesty. TruSathi is designed to make every step clear, ensuring your search is private, verified, and always respectful.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-all hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    Start Free <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    Explore Profiles
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust Signal Cards */}
            <div className="grid gap-4">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="rounded-[2rem] border border-slate-100 bg-white p-6 hover:border-amber-200 transition-all duration-300 group hover:shadow-xl hover:shadow-slate-100">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-500 group-hover:scale-110 transition-transform">
                    <signal.icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{signal.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{signal.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyChoose />

      {/* Member Journey Section - Cinematic Dark View */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-10 md:pt-12 pb-0 text-white md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,1),transparent_50%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
              <Camera size={14} /> The Journey Together
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tighter md:text-6xl leading-none">
              Simple. True. <br /> <span className="text-amber-500">Transparent.</span>
            </h2>
            <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-slate-400">
              Your search for a life partner deserves a path that is easy to trust. From selfie-verification to direct community support, we&apos;ve removed the noise so you can focus on what&apos;s real.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {journeySteps.map((step, index) => (
              <div key={step} className="group rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm hover:bg-white/[0.06] transition-all hover:-translate-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500/60 group-hover:text-amber-500 transition-colors">Step {index + 1}</p>
                <p className="mt-4 text-lg font-bold leading-snug text-slate-200 group-hover:text-white transition-colors">{step}</p>
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