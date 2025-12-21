import React, { useState } from 'react';
import { Heart, Search, Shield, Users, CheckCircle, Menu, X, ChevronRight, Facebook, Twitter, Instagram, UserPlus, Lock } from 'lucide-react';

export default function TrusathiUI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchData, setSearchData] = useState({ lookingFor: 'Bride', ageMin: '21', ageMax: '35', religion: '' });

  // Dummy data for featured profiles (Group Admin created)
  const featuredProfiles = [
    { id: 'TS-201', type: 'Bride', age: 26, height: "5'4\"", job: 'Software Engineer', location: 'Bangalore', verifiedBy: 'Arya Vysya Group' },
    { id: 'TS-892', type: 'Groom', age: 29, height: "5'11\"", job: 'Doctor (MD)', location: 'Mumbai', verifiedBy: 'Mumbai Medicos' },
    { id: 'TS-334', type: 'Bride', age: 24, height: "5'2\"", job: 'Chartered Accountant', location: 'Delhi', verifiedBy: 'CA Network North' },
  ];

  const features = [
    { icon: <Users className="w-8 h-8 text-rose-600" />, title: 'Community Verified', desc: 'Profiles are sourced and verified by trusted Group Admins from your own community WhatsApp groups.' },
    { icon: <Shield className="w-8 h-8 text-rose-600" />, title: '100% Trust', desc: 'No fake profiles. Every member is vetted by a Group Admin before being listed on Trusathi.' },
    { icon: <Lock className="w-8 h-8 text-rose-600" />, title: 'Privacy First', desc: 'Your contact details are secure. Only verified members can initiate connection requests.' },
  ];

  return (
    <div className="min-h-screen bg-rose-50/30 font-sans text-gray-800">
      
      {/* --- Navbar --- */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white">
                <Heart fill="currentColor" size={20} />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight block leading-none">Trusathi</span>
                <span className="text-xs text-rose-600 font-medium tracking-wide uppercase">Trusted Matrimony</span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-gray-600 hover:text-rose-600 font-medium transition">Browse Profiles</a>
              <a href="#" className="text-gray-600 hover:text-rose-600 font-medium transition">Communities</a>
              <a href="#" className="text-gray-600 hover:text-rose-600 font-medium transition">About Us</a>
              <button className="text-rose-600 font-medium hover:bg-rose-50 px-4 py-2 rounded-full transition">Login</button>
              <button className="bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 shadow-md transition transform hover:-translate-y-0.5">
                Register Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-rose-600 p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3 shadow-lg">
            <a href="#" className="block text-gray-700 hover:text-rose-600 font-medium py-2">Browse Profiles</a>
            <a href="#" className="block text-gray-700 hover:text-rose-600 font-medium py-2">Communities</a>
            <a href="#" className="block text-gray-700 hover:text-rose-600 font-medium py-2">About Us</a>
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
              <button className="w-full text-center text-rose-600 font-medium py-2 border border-rose-100 rounded-lg">Login</button>
              <button className="w-full bg-rose-600 text-white font-medium py-3 rounded-lg shadow">Register Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <div className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-800/50 border border-rose-700 text-rose-200 text-sm mb-6">
                <CheckCircle size={14} /> Verified by Community Group Admins
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Find Your Soulmate within your <span className="text-rose-300">Trusted Community.</span>
              </h1>
              <p className="text-lg text-rose-100 mb-8 leading-relaxed max-w-lg">
                The only platform where profiles are curated by Group Admins from trusted WhatsApp groups. Authentic, Safe, and Reliable.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-rose-900 px-6 py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-50 transition">
                  Join as Member
                </button>
                <button className="bg-transparent border-2 border-rose-300 text-white px-6 py-3.5 rounded-full font-bold hover:bg-rose-800 transition">
                  Create Group Admin Account
                </button>
              </div>
            </div>

            {/* Search Widget */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-rose-100/20">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Search size={20} className="text-rose-600" /> Search for a Match
              </h3>
              
              <div className="space-y-5">
                {/* Looking For */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">I'm looking for a</label>
                  <div className="flex gap-4">
                    {['Bride', 'Groom'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setSearchData({...searchData, lookingFor: type})}
                        className={`flex-1 py-3 rounded-xl border font-medium transition ${
                          searchData.lookingFor === type 
                          ? 'bg-rose-600 text-white border-rose-600' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Age Min</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none">
                      {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(n => <option key={n}>{n} Yrs</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Age Max</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none" defaultValue="28 Yrs">
                      {[25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(n => <option key={n}>{n} Yrs</option>)}
                    </select>
                  </div>
                </div>

                {/* Religion */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Religion / Community</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none">
                    <option>Select Community</option>
                    <option>Hindu</option>
                    <option>Muslim</option>
                    <option>Christian</option>
                    <option>Sikh</option>
                    <option>Jain</option>
                  </select>
                </div>

                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-2">
                  Find Matches
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- How it Works / Features --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rose-600 font-bold tracking-wider uppercase text-sm">How Trusathi Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Trust through Community Leaders</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Unlike other open platforms, Trusathi relies on a network of Group Admins who verify members from their known social circles.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Featured Profiles --- */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Verified Members</h2>
              <p className="text-gray-500">Profiles recently added by Group Admins</p>
            </div>
            <a href="#" className="flex items-center text-rose-600 font-bold hover:text-rose-700 transition">
              View all profiles <ChevronRight size={20} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProfiles.map((profile, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition group">
                {/* Profile Placeholder Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                     <Users size={48} className="opacity-20" />
                   </div>
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-700">
                     ID: {profile.id}
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                     <span className="text-white font-bold text-lg">{profile.age} Yrs, {profile.height}</span>
                   </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{profile.job}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                         {profile.location}
                      </p>
                    </div>
                  </div>
                  
                  {/* Verification Badge */}
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-3 mb-6">
                    <Shield className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-800 uppercase tracking-wide">Verified by Admin</p>
                      <p className="text-sm text-rose-900 font-medium">{profile.verifiedBy}</p>
                    </div>
                  </div>

                  <button className="w-full py-3 border-2 border-rose-600 text-rose-600 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition">
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA for Group Admins --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

           <div className="relative z-10 md:flex items-center justify-between gap-12">
             <div className="mb-8 md:mb-0 max-w-2xl">
               <span className="text-rose-400 font-bold uppercase tracking-wider text-sm mb-2 block">For Community Leaders</span>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Do you manage a Community WhatsApp Group?</h2>
               <p className="text-gray-300 text-lg">
                 Become a <strong>Group Admin</strong> on Trusathi. Create profiles for your community members, manage their visibility, and help them find trusted matches safely.
               </p>
             </div>
             <div className="flex flex-col gap-4 w-full md:w-auto">
                <button className="bg-rose-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-rose-700 transition flex items-center justify-center gap-2 whitespace-nowrap">
                   <UserPlus size={20} /> Create Admin Account
                </button>
                <p className="text-gray-400 text-xs text-center">Approved by Super Admin only</p>
             </div>
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white">
                  <Heart fill="currentColor" size={16} />
                </div>
                <span className="text-xl font-bold text-gray-900">Trusathi</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 pr-4">
                Redefining matrimony with trust. A community-first platform where every profile is verified by a known group administrator.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-rose-600 transition"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-rose-600 transition"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-rose-600 transition"><Instagram size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-rose-600 transition">Browse Brides</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Browse Grooms</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Success Stories</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Group List</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-rose-600 transition">For Group Admins</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Verification Process</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-rose-600 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-rose-600 transition">Safety Tips</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 Trusathi Matrimony. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Lock size={14} /> SSL Secured</span>
              <span className="flex items-center gap-1"><Shield size={14} /> Admin Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}