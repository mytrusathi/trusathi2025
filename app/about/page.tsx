import React from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Users, Heart, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-indigo-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Restoring <span className="text-rose-400">Trust</span> in Matrimony
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
            We are building India's first decentralized, community-verified matchmaking platform. 
            No algorithms, just real people helping their communities find love.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-bold mb-4">
              <Heart size={16} fill="currentColor" /> Our Mission
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why we started Trusathi
            </h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Modern matrimony apps are broken. They are flooded with fake profiles, 
                marketing calls, and impersonal algorithms that don't understand culture or family values.
              </p>
              <p>
                We realized the safest way to find a partner has always been through 
                <strong> "Word of Mouth"</strong> and trusted community elders.
              </p>
              <p>
                Trusathi digitizes this trust. We empower <strong>Community Group Admins</strong>—the people who actually know you—to curate and verify profiles.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative">
            <div className="absolute -top-4 -right-4 bg-indigo-600 text-white p-4 rounded-xl shadow-lg">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">The Trusathi Promise</h3>
            <ul className="space-y-4">
              {[
                "100% Manually Verified Profiles",
                "Zero Marketing Spam",
                "Community-Specific Matches",
                "Safe Contact Details"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="text-green-500 shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works (Values) */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Built on Three Pillars</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We don't mix everyone together. We respect the nuances of different communities, 
                castes, and regions, giving you matches that align with your family's values.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Verified</h3>
              <p className="text-gray-600">
                Every profile is uploaded by a Group Admin who acts as a voucher. 
                If a profile is reported, the Admin is held accountable, ensuring high quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Centric</h3>
              <p className="text-gray-600">
                Your phone number and photos aren't public property. Only verified members 
                approved by your Group Admin can initiate contact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-indigo-900 rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to find your partner?</h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of verified members who have chosen the safe, community-led way to get married.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Register as Member
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 bg-transparent border-2 border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-800 transition"
            >
              Become a Group Admin
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}