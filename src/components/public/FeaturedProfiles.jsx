export default function FeaturedProfiles() {
  const profiles = [
    { name: "Payal", age: 26, height: "5'1\"", job: "Private school teacher", city: "Samana", code: "HS-00010" },
    { name: "Komal Sain", age: 30, height: "5'3\"", job: "Pvt. teacher", city: "Patiala", code: "HS-00009" },
    { name: "Ritika", age: 32, height: "5'5\"", job: "SBI Life Insurance", city: "Patiala", code: "HS-00008" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <h2 className="text-xl font-semibold">Featured Profiles</h2>
        <p className="text-sm text-gray-500 mb-8">
          Showing 14 of 14 profiles
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {profiles.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6">
              
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">
                    {p.age} yrs · {p.height} · Female
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div>🏷 Profile No: {p.code}</div>
                <div>💼 {p.job}</div>
                <div>📍 {p.city}</div>
              </div>

              <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                Bahawalpuri Vehavik Seva Sangh
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
