import { Handshake, Facebook, Twitter, Instagram, Mail, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-background pt-10 pb-10 transition-colors border-t border-border/40 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Motto Section - Simplified & Trust-Focused */}
        <div className="mb-20 rounded-[2.5rem] bg-card p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left border border-border/50 relative group shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl relative z-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform duration-500">
              <Handshake size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Our Commitment to Service</h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg md:text-xl opacity-90">
                &quot;TruSathi is a community-driven effort to provide 100% free, honest matchmaking. We believe in building bonds through transparency and trust.&quot;
              </p>
            </div>
          </div>

          <div className="shrink-0 relative z-10">
            <div className="px-6 py-3 bg-secondary rounded-xl text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-border shadow-sm">
              <Sparkles size={16} className="text-accent" /> 100% Free Portal
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            {/* Logo Section */}
            <div className="mb-8">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-xs font-medium opacity-80">
              Connecting hearts through community trust, heritage, and complete transparency.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-accent uppercase tracking-widest text-[11px] mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li><Link href="/search?role=Bride" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Browse Brides</Link></li>
              <li><Link href="/search?role=Groom" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Browse Grooms</Link></li>
              <li><Link href="/communities" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Community Hubs</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Our Mission</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold text-accent uppercase tracking-widest text-[11px] mb-8">Help & Support</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Guidance & FAQ</Link></li>
              <li><Link href="/support#safety" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Safety Tips</Link></li>
              <li className="flex items-center gap-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">Email Us</p>
                  <a href="mailto:support@trusathi.com" className="text-foreground hover:text-primary transition-colors font-bold text-sm">
                    support@trusathi.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Section */}
          <div>
            <h4 className="font-bold text-accent uppercase tracking-widest text-[11px] mb-8">Platform Policy</h4>
            <div className="text-[11px] text-muted-foreground mb-6 leading-relaxed bg-secondary/50 p-6 rounded-2xl border border-border italic opacity-90">
              Important: TruSathi is a facilitator. We encourage users to independently verify all profiles before proceeding.
            </div>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Clean & Safe */}
        <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-foreground tracking-tight">&copy; {new Date().getFullYear()} truSathi. All Rights Reserved.</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-50">Preserving Tradition • Empowering Communities • Serving Families</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <VisitorCounter />
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 text-primary rounded-full border border-primary/20">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Community Verified Portal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary transition-all active:scale-95">
      {icon}
    </a>
  );
}