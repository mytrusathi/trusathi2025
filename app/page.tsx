'use client'

import React, { useState } from 'react';
import { Heart, Search, Shield, Users, CheckCircle, Menu, X, ChevronRight, Facebook, Twitter, Instagram, UserPlus, Lock } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer'
import ProfileCard from '../components/ProfileCard'



export default function TrusathiUI() {
  const [searchData, setSearchData] = useState({ lookingFor: 'Bride', ageMin: '21', ageMax: '35', religion: '' });

  // Dummy data for featured profiles (Group Admin created)
  const featuredProfiles = [
    { id: 'TS-201', type: 'Bride', age: 26, height: "5'4\"", job: 'Software Engineer', location: 'Bangalore', verifiedBy: 'Arya Vysya Group' },
    { id: 'TS-892', type: 'Groom', age: 29, height: "5'11\"", job: 'Doctor (MD)', location: 'Mumbai', verifiedBy: 'Mumbai Medicos' },
    { id: 'TS-334', type: 'Bride', age: 24, height: "5'2\"", job: 'Chartered Accountant', location: 'Delhi', verifiedBy: 'CA Network North' },
  ];

  const features = [
    { icon: <Users className="w-8 h-8 text-indigo-600" />, title: 'Community Verified', desc: 'Profiles are sourced and verified by trusted Group Admins from your own community WhatsApp groups.' },
    { icon: <Shield className="w-8 h-8 text-indigo-600" />, title: '100% Trust', desc: 'No fake profiles. Every member is vetted by a Group Admin before being listed on Trusathi.' },
    { icon: <Lock className="w-8 h-8 text-indigo-600" />, title: 'Privacy First', desc: 'Your contact details are secure. Only verified members can initiate connection requests.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
           {/* --- Hero Section --- */}
      <div className="relative bg-indigo-900 overflow-hidden">
        {/* Abstract Background Shapes (Restored from previous UI) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-200 text-sm mb-6">
              <CheckCircle size={14} /> Verified by Community Group Admins
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Find Your Soulmate within your <span className="text-indigo-300">Trusted Community.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              The only platform where profiles are curated by Group Admins from trusted WhatsApp groups. Authentic, Safe, and Reliable.
            </p>
          </div>

          {/* Search Widget (Restored Floating Style) */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-5xl mx-auto transform translate-y-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              
              {/* Looking For */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Looking For</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-gray-700 appearance-none"
                    value={searchData.lookingFor}
                    onChange={(e) => setSearchData({...searchData, lookingFor: e.target.value})}
                  >
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <Users size={16} />
                  </div>
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Age Range</label>
                <div className="flex gap-2">
                  <select className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-gray-700">
                    {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <select className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-gray-700" defaultValue="28">
                    {[25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Religion */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Community</label>
                <div className="relative">
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-gray-700 appearance-none">
                    <option>All Communities</option>
                    <option>Hindu</option>
                    <option>Muslim</option>
                    <option>Christian</option>
                    <option>Sikh</option>
                    <option>Jain</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button className="w-full h-12.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-lg">
                  <Search size={20} />
                  Find Matches
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Spacer for Search Widget --- */}
      <div className="h-24 bg-gray-50"></div>

      {/* --- How it Works / Features --- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose Trusathi?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We're dedicated to making your search safe, reliable, and community-focused.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

  <section className="bg-indigo-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Verified Members</h2>
              <p className="text-gray-500">Profiles recently added by Group Admins</p>
            </div>
            <a href="#" className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition">
              View all <ChevronRight size={20} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}    
          </div>

          <div className="mt-8 text-center md:hidden">
            <a href="#" className="inline-flex items-center text-indigo-600 font-bold">
              View all profiles <ChevronRight size={20} />
            </a>
          </div>
        </div>
    </section>

      {/* --- CTA for Group Admins --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

           <div className="relative z-10 md:flex items-center justify-between gap-12">
             <div className="mb-8 md:mb-0 max-w-2xl">
               <span className="text-indigo-300 font-bold uppercase tracking-wider text-sm mb-2 block">For Community Leaders</span>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Do you manage a WhatsApp Group?</h2>
               <p className="text-indigo-100 text-lg">
                 Become a <strong>Group Admin</strong> on Trusathi. Create profiles for your community members, manage their visibility, and help them find trusted matches safely.
               </p>
             </div>
             <div className="flex flex-col gap-4 w-full md:w-auto">
                <button className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 whitespace-nowrap">
                   <UserPlus size={20} /> Create Admin Account
                </button>
             </div>
           </div>
        </div>
      </section>

    <Footer />

    </div>
  );
}