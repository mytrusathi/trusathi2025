import { Users, Shield, Lock, Heart, Globe, Sparkles } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: 'Screened Profiles',
      desc: 'Profiles are personally vetted by trusted Group Admins from your own local community circles.',
      accent: 'bg-indigo-50 border-indigo-100'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Vow of Honesty',
      desc: 'No fake stories or bots. TruSathi is built on the integrity of real connections and confirmed truth.',
      accent: 'bg-emerald-50 border-emerald-100'
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: 'Service to Mankind',
      desc: 'Our platform is a humble effort remains free of charge, aimed at helping you find your life partner.',
      accent: 'bg-rose-50 border-rose-100'
    }
  ]

  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-50/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 transform hover:scale-105 transition-transform duration-300 shadow-sm border border-indigo-100">
             <Sparkles size={14} /> Why Choose TruSathi
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Built on <span className="text-indigo-600">Trust</span>, <br/>Defined by <span className="text-rose-500">Service</span>.
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
              className="group p-10 bg-white rounded-[3rem] border border-slate-100 transition-all duration-500 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/40 hover:-translate-y-2"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.accent.split(' ')[0]} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2`}></div>
              
              <div className={`w-16 h-16 ${feature.accent} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/50 bg-white/50 backdrop-blur-sm`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                {feature.desc}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                 Learn More <Globe size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
