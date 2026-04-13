import { Handshake, Facebook, Twitter, Instagram, Mail, ShieldCheck, Sparkles } from 'lucide-react'; // Heart ki jagah Handshake
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border pt-24 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Motto Section - Enhanced UI */}
        <div className="mb-20 bg-card rounded-[3.5rem] p-10 md:p-16 border border-border shadow-[0_30px_70px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-3xl">
            <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white shrink-0 shadow-2xl shadow-primary/30">
              <Handshake size={44} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-foreground tracking-tighter">Service to Mankind</h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-xl">
                &quot;TruSathi is a humble effort to serve families by providing 100% free matchmaking. We believe in transparency and honest, lifelong bonds.&quot;
              </p>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="px-8 py-5 bg-primary/5 rounded-2xl text-primary font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 border border-primary/10">
              <Sparkles size={18} className="text-accent" /> Always Free Portal
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 mb-20 px-4 md:px-0">
          <div className="col-span-2 lg:col-span-1">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 mb-10 group active:scale-95 transition-all">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <Handshake size={24} />
              </div>
              <span className="text-3xl font-black text-foreground tracking-tighter font-serif">truSathi</span>
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed mb-12 max-w-xs font-medium">
              Connecting families through integrity, tradition, and transparency. Your search sanctuary.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-[0.3em] text-[10px] mb-10">Navigation</h4>
            <ul className="space-y-6 text-sm font-black text-muted-foreground">
              <li><Link href="/search?role=Bride" className="hover:text-primary transition-colors">Browse Brides</Link></li>
              <li><Link href="/search?role=Groom" className="hover:text-primary transition-colors">Browse Grooms</Link></li>
              <li><Link href="/communities" className="hover:text-primary transition-colors">Community Trustees</Link></li>
              <li><Link href="/success-stories" className="hover:text-primary transition-colors">Mission Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-[0.3em] text-[10px] mb-10">Care Center</h4>
            <ul className="space-y-6 text-sm font-black text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-colors">Help & FAQ</Link></li>
              <li><Link href="/support#safety" className="hover:text-primary transition-colors">Safety Protocol</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Why TruSathi?</Link></li>
              <li className="flex items-center gap-4 pt-4">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Support Desk</p>
                  <a href="mailto:support@trusathi.com" className="text-primary hover:underline font-black">
                    support@trusathi.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-[0.3em] text-[10px] mb-10">Policies</h4>
            <div className="text-[11px] text-muted-foreground mb-8 leading-relaxed bg-card p-6 rounded-3xl border border-border shadow-sm transition-colors">
              TruSathi provides 100% free access to authenticated contacts. Our Community Trustees independently manage profiles for higher accuracy.
            </div>
            <ul className="space-y-6 text-sm font-black text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-base font-black text-muted-foreground">&copy; {new Date().getFullYear()} truSathi. The Honest Choice.</p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-60">Excellence in Service • Authenticity in Matches</p>
          </div>

          <div className="flex items-center gap-12">
            <VisitorCounter />
            <div className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-full shadow-2xl shadow-primary/20 border border-primary/10">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Verified Sanctuary</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-1 active:scale-95">
      {icon}
    </a>
  );
}