import { CheckCircle } from 'lucide-react'
import SearchBar from './SearchBar'

export default function Hero() {
  return (
    <section className="relative bg-indigo-900 overflow-hidden">

      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">

        {/* Text Content */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-200 text-sm mb-6">
            <CheckCircle size={14} />
            Verified by Community Group Admins
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Find Your Soulmate within your{' '}
            <span className="text-indigo-300">Trusted Community.</span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            The only platform where profiles are curated by Group Admins from trusted WhatsApp groups.
            Authentic, Safe, and Reliable.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar />
      </div>

    </section>
  )
}
