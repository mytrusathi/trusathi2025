import { Users, Shield, Handshake, ArrowRight, Sparkles } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: 'Screened Profiles',
      desc: 'Profiles are personally vetted by trusted Community Trustees from your own local social and community circles.',
      accent: 'bg-primary border-primary/20'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'Vow of Honesty',
      desc: 'No fake stories or bots. TruSathi is built on the integrity of real connections and confirmed, authenticated truth.',
      accent: 'bg-primary border-primary/20'
    },
    {
      icon: <Handshake className="w-8 h-8 text-white" />,
      title: 'Service to Mankind',
      desc: 'Our platform is a humble effort that remains free of charge, aimed purely at helping families find honest matches.',
      accent: 'bg-primary border-primary/20'
    }
  ]

  return (
    <section id="about" className="pt-24 pb-24 bg-muted/50 relative overflow-hidden text-left transition-colors">
      {/* Premium Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center md:text-left max-w-4xl mb-24 space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 shadow-xl shadow-primary/5">
            <Sparkles size={14} className="text-accent" /> Why Choose TruSathi
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] italic font-serif">
            Built on <span className="text-primary not-italic">Trust</span>, <br />Defined by <span className="text-foreground not-italic underline decoration-primary/20 decoration-8 underline-offset-8">Service</span>.
          </h2>
          <p className="text-muted-foreground text-xl md:text-3xl font-medium leading-tight max-w-2xl px-1">
            We are redefining matchmaking by removing the business aspect and focusing
            purely on authentic community connections.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-12 bg-card rounded-[3.5rem] border border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] transition-all duration-700 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-3"
            >
              {/* Hover Luxury Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-y-1/2 translate-x-1/2"></div>

              {/* Icon Container - Maroon Focus */}
              <div className={`w-20 h-20 bg-primary rounded-[1.75rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-primary/10 backdrop-blur-sm`}>
                {feature.icon}
              </div>

              <h3 className="text-3xl font-black text-foreground mb-6 tracking-tighter leading-none">
                {feature.title}
              </h3>

              <p className="text-muted-foreground font-medium leading-relaxed text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                {feature.desc}
              </p>

              <div className="mt-12 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-all duration-700 translate-y-3 group-hover:translate-y-0">
                Explore More <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}