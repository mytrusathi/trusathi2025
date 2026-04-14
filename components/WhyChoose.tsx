import { Users, Shield, Handshake, ArrowRight, Sparkles } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Community Verified',
      desc: 'Profiles reviewed by local community circles to ensure genuine intent and authentic search.',
      accent: 'bg-primary'
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: 'Privacy Protected',
      desc: 'Your data is handled with care. We focus on real connections without the noise of typical apps.',
      accent: 'bg-primary'
    },
    {
      icon: <Handshake className="w-6 h-6 text-white" />,
      title: 'Always Free Service',
      desc: 'A noble mission to help families find their perfect match without any membership fees.',
      accent: 'bg-primary'
    }
  ]

  return (
    <section id="about" className="py-0 md:py-0 bg-background relative overflow-hidden scroll-mt-10">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header Section: Reduced sizes and spacing */}
        <div className="text-center md:text-left max-w-4xl mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-secondary border border-border/40 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-primary" /> The TruSathi Vision
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Founded on <span className="text-primary">Trust</span>, <br />
            Driven by <span className="text-foreground/80 border-b-4 border-primary/20">Service</span>.
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl opacity-90">
            We are bringing transparency back to matchmaking by focusing on
            authentic, community-driven connections—completely free of cost.
          </p>
        </div>

        {/* Features Grid: Compact Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[2rem] border border-border/50 bg-card/50 hover:bg-card hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              {/* Icon Container: Size reduced from 20 to 14 */}
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-muted-foreground font-medium leading-relaxed text-base opacity-85 group-hover:opacity-100">
                {feature.desc}
              </p>

              {/* Action Link: Simplified wording */}
              <div className="mt-8 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                Learn More <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}