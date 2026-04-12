import { Handshake, Facebook, Twitter, Instagram, Mail, ShieldCheck, Sparkles } from 'lucide-react'; // Heart ki jagah Handshake
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Motto Section - Updated for TruSathi Identity */}
        <div className="mb-10 bg-white rounded-3xl p-8 border border-amber-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-left max-w-2xl">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <Handshake size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Our Motto: Service to Mankind</h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                &quot;TruSathi is a humble effort to serve mankind by providing 100% free matchmaking via our portal. We never charge for our services.&quot;
              </p>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="px-5 py-3 bg-amber-50 rounded-2xl text-amber-700 font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={18} /> Transparent & Free
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            {/* Logo Section - Updated to Navy/Amber */}
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                <Handshake size={20} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">truSathi</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xs font-medium">
              Your Trusted Search Companion. Connecting families through integrity, tradition, and transparency.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/search?role=Bride" className="hover:text-amber-600 transition-colors">Browse Brides</Link></li>
              <li><Link href="/search?role=Groom" className="hover:text-amber-600 transition-colors">Browse Grooms</Link></li>
              <li><Link href="/communities" className="hover:text-amber-600 transition-colors">Authentic Groups</Link></li>
              <li><Link href="/success-stories" className="hover:text-amber-600 transition-colors">Our Mission</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/support" className="hover:text-amber-600 transition-colors">Help Center &amp; FAQ</Link></li>
              <li><Link href="/support#safety" className="hover:text-amber-600 transition-colors">Safety Tips</Link></li>
              <li><Link href="/about" className="hover:text-amber-600 transition-colors">Why TruSathi?</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Mail size={16} className="text-slate-400" />
                <a href="mailto:support@trusathi.com" className="text-amber-600 hover:underline">
                  support@trusathi.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Service Policy</h4>
            {/* Disclaimer Box - Made legally safe */}
            <p className="text-[10px] text-slate-400 mb-6 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
              Direct portal users can access authenticated contacts free of cost. Independent Community Group Admins manage their own profiles and may have their own guidelines. Users must verify all details before proceeding.
            </p>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/terms" className="hover:text-amber-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Updated with Search Companion Identity */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-slate-400">&copy; {new Date().getFullYear()} truSathi. Your Trusted Search Companion.</p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Excellence in Service • Integrity in Search</p>
          </div>

          <div className="flex items-center gap-8">
            <VisitorCounter />
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-100">
              <ShieldCheck size={16} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-50 transition-all hover:-translate-y-1">
      {icon}
    </a>
  );
}