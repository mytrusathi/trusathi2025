import ProfileCard from './ProfileCard'
import { ChevronRight } from 'lucide-react'

export default function FeaturedProfiles() {
  // Dummy data for now (later from Firebase)
  const featuredProfiles = [
    {
      id: 'TS-201',
      job: 'Software Engineer',
      location: 'Bangalore',
      verifiedBy: 'Arya Vysya Group'
    },
    {
      id: 'TS-892',
      job: 'Doctor (MD)',
      location: 'Mumbai',
      verifiedBy: 'Mumbai Medicos'
    },
    {
      id: 'TS-334',
      job: 'Chartered Accountant',
      location: 'Delhi',
      verifiedBy: 'CA Network North'
    }
  ]

  return (
    <section className="bg-indigo-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Verified Members
            </h2>
            <p className="text-gray-500">
              Profiles recently added by Group Admins
            </p>
          </div>

          <a
            href="#"
            className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700"
          >
            View all <ChevronRight size={20} />
          </a>
        </div>

        {/* Profile Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <a href="#" className="inline-flex items-center text-indigo-600 font-bold">
            View all profiles <ChevronRight size={20} />
          </a>
        </div>

      </div>
    </section>
  )
}
