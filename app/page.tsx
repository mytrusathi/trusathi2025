'use client'

import Navbar from "../components/Navbar"
import Hero from '../components/Hero'
import WhyChoose from '../components/WhyChoose'
import FeaturedProfiles from '../components/FeaturedProfiles'
import GroupAdminCTA from '../components/GroupAdminCTA'
import Footer from '../components/Footer'

export default function TrusathiUI() {

  return (
    <>
    
     {/* Top Navigation */}
      <Navbar />

      {/* Hero Section + Search */}
      <Hero />

      {/* Spacer for floating search */}
      <div className="h-24 bg-gray-50" />

      {/* Why Choose Trusathi */}
      <WhyChoose />

      {/* Featured / Verified Profiles */}
      <FeaturedProfiles />

      {/* Group Admin Call-To-Action */}
      <GroupAdminCTA />

      {/* Footer */}
      <Footer />
    </>
   
  )
}