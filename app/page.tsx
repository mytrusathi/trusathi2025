import Link from 'next/link';
import { ArrowRight, Camera, CheckCircle2, MessageSquareText, ShieldCheck, Smartphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChoose from '../components/WhyChoose';
import FeaturedProfiles from '../components/FeaturedProfiles';
import GroupAdminCTA from '../components/GroupAdminCTA';
import Footer from '../components/Footer';

const trustSignals = [
  {
    title: 'Verify in Minutes',
    copy: 'Members can confirm email, phone number, and a live selfie directly from their dashboard.',
    icon: Smartphone,
  },
  {
    title: 'Community-Led Screening',
    copy: 'Each connection sits inside a moderated ecosystem instead of an anonymous swipe feed.',
    icon: ShieldCheck,
  },
  {
    title: 'Safe Admin Review',
    copy: 'A direct trust-desk chat gives families one clear place to verify authenticity before moving ahead.',
    icon: MessageSquareText,
  },
];

const journeySteps = [
  'Create a biodata and keep it complete.',
  'Verify phone, email, and a live selfie.',
  'Shortlist profiles and send interests safely.',
  'Speak to the super admin trust desk when needed.',
];

export default function TrusathiUI() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="relative bg-[#f8f7f2] px-4 pb-24 pt-10 md:px-8">
        <div className="mx-auto -mt-12 max-w-7xl rounded-[2.5rem] border border-[#e7e2d8] bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:-mt-20 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#334155_100%)] p-8 text-white md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
                <CheckCircle2 size={14} /> Trust-First Matchmaking
              </div>
              <h2 className="mt-6 max-w-2xl text-3xl font-black tracking-tight md:text-5xl">
                The home page now leads with authenticity, not noise.
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 md:text-base">
                TruSathi works best when every step feels clear to parents, candidates, and admins. This landing experience now highlights verification, screening, and guided conversations much more directly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-900 transition-all hover:bg-amber-50"
                >
                  Start Free <ArrowRight size={14} />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/10"
                >
                  Explore Profiles
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="rounded-[2rem] border border-slate-200 bg-[#fffdf8] p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <signal.icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{signal.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{signal.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyChoose />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              <Camera size={14} /> Modern Member Journey
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              From discovery to verification, the flow is now easier to trust.
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-300">
              Members can shortlist profiles, cancel pending interests, open the front camera for selfie capture, and message the super admin directly when they want to improve authenticity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {journeySteps.map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Step {index + 1}</p>
                <p className="mt-3 text-lg font-bold leading-7 text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProfiles />
      <GroupAdminCTA />
      <Footer />
    </>
  );
}
