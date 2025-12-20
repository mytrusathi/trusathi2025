export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-700 py-24">
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 text-center text-white">
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/30 text-xs mb-6">
          ❤ TRUSTED COMMUNITY CONNECTIONS
        </div>

        <h1 className="text-4xl md:text-6xl font-bold">
          Find Your <span className="text-yellow-300">TruSathi</span>
        </h1>

        <p className="mt-5 max-w-3xl mx-auto text-white/90">
          Rishtey wahi, jo bharose se judey. — Discover handpicked profiles from trusted WhatsApp groups,
          curated with care for serious, meaningful relationships.
        </p>

        {/* Search Box */}
        <div className="mt-12 bg-white rounded-2xl p-5 shadow-xl text-gray-700">
          
          <div className="grid md:grid-cols-[1.5fr_1fr_auto] gap-4">
            <input
              placeholder="Search name, profession, city, group..."
              className="border rounded-xl px-4 py-3 outline-none"
            />
            <select className="border rounded-xl px-4 py-3">
              <option>All Profiles</option>
            </select>
            <button className="rounded-xl px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium">
              View 14 Profiles
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <input className="border rounded-xl px-4 py-3" placeholder="Age Min - Max" />
            <input className="border rounded-xl px-4 py-3" placeholder="City e.g. Delhi, Jaipur" />
            <input className="border rounded-xl px-4 py-3" placeholder="Caste e.g. Aggarwal" />
            <select className="border rounded-xl px-4 py-3">
              <option>Manglik : Any</option>
            </select>
          </div>

        </div>
      </div>
    </section>
  );
}
