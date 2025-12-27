
import { Heart, Shield, Facebook, Twitter, Instagram, } from 'lucide-react';
import Link from 'next/link' 

export default function Footer() {
  return (
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Heart fill="currentColor" size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900">Trusathi</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
               Connecting hearts, families, and communities through lifelong bonds. Safe, authentic, and reliable matchmaking for everyone.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition"><Instagram size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition">Browse Brides</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Browse Grooms</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Success Stories</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Group List</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition">For Group Admins</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Verification Process</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <Link 
                  href="/terms" 
                  className="hover:text-indigo-600 transition">
                    Terms & Conditions
                    </Link></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 Trusathi. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Shield size={14} /> 100% Secure</span>
            </div>
          </div>
        </div>
      </footer>

    )
}