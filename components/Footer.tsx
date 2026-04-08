import { Heart, Shield, Facebook, Twitter, Instagram, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link' 
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                 <Heart fill="currentColor" size={20} />
              </div>
              <span className="text-2xl font-black text-indigo-900 tracking-tight">TruSathi</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
              The premier community-verified matrimony platform. Connecting families through trust and authenticity.
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
              <li><Link href="/search?role=Bride" className="hover:text-indigo-600 transition-colors">Browse Brides</Link></li>
              <li><Link href="/search?role=Groom" className="hover:text-indigo-600 transition-colors">Browse Grooms</Link></li>
              <li><Link href="/communities" className="hover:text-indigo-600 transition-colors">Verified Groups</Link></li>
              <li><Link href="/success-stories" className="hover:text-indigo-600 transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/support" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link href="/support#safety" className="hover:text-indigo-600 transition-colors">Safety Tips</Link></li>
              <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About TruSathi</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Mail size={16} className="text-slate-400" />
                <a href="mailto:support@trusathi.com" className="text-indigo-600 hover:underline">
                  support@trusathi.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
             <p className="text-sm font-bold text-slate-400">© {new Date().getFullYear()} TruSathi. Handcrafted with heart.</p>
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Designed for Communities</p>
          </div>
          
          <div className="flex items-center gap-8">
             <VisitorCounter />
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Secure</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100 transition-all">
      {icon}
    </a>
  );
}