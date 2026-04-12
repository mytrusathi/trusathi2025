import { Users, Shield, Handshake, Globe, Sparkles } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: 'Screened Profiles',
      desc: 'Profiles are personally vetted by trusted Group Admins from your own local community circles.',
      accent: 'bg-slate-50 border-slate-200'
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-500" />,
      title: 'Vow of Honesty',
      desc: 'No fake stories or bots. TruSathi is built on the integrity of real connections and confirmed truth.',
      accent: 'bg-slate-50 border-slate-200'
    },
    {
      icon: <Handshake className="w-8 h-8 text-amber-500" />, // Heart ko Handshake se replace kiya
      title: 'Service to Mankind',
      desc: 'Our platform is a humble effort that remains free of charge, aimed purely at helping you find your life partner.',
      accent: 'bg-slate-50 border-slate-200'
    }
  ]

  return (
    <section id="about" className="pt-10 md:pt-10 pb-8 md:pb-0 bg-white relative overflow-hidden">
      {/* Background Decor - Updated with Amber/Slate tones */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-50/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-50/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 transform hover:scale-105 transition-transform duration-300 shadow-sm border border-slate-800">
            <Sparkles size={14} /> Why Choose TruSathi
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Built on <span className="text-amber-500">Trust</span>, <br />Defined by <span className="text-slate-900">Service</span>.
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            We are redefining matchmaking by removing the business aspect and focusing
            purely on authentic community connections.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-10 bg-white rounded-[3rem] border border-slate-100 transition-all duration-500 relative overflow-hidden hover:shadow-2xl hover:shadow-amber-100/40 hover:-translate-y-2"
            >
              {/* Hover Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2"></div>

              {/* Icon Container - Navy Background */}
              <div className={`w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-slate-800 backdrop-blur-sm`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                Learn More <Globe size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}