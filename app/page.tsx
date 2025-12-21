'use client'

import { UserPlus} from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import WhyChoose from '../components/WhyChoose'
import FeaturedProfiles from '../components/FeaturedProfiles'
import GroupAdminCTA from '../components/GroupAdminCTA'

export default function TrusathiUI() {

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
      <Hero />
      {/* --- Spacer for Search Widget --- */}
      <div className="h-24 bg-gray-50"></div>

     <WhyChoose />
     <FeaturedProfiles />
    <GroupAdminCTA />
    <Footer />

    </div>
  );
}