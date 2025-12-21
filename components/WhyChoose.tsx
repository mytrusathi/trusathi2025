import { Users, Shield, Lock } from 'lucide-react'

export default function WhyChoose() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: 'Community Verified',
      desc: 'Profiles are sourced and verified by trusted Group Admins from your own community WhatsApp groups.'
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: '100% Trust',
      desc: 'No fake profiles. Every member is vetted by a Group Admin before being listed on Trusathi.'
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: 'Privacy First',
      desc: 'Your contact details are secure. Only verified members can initiate connection requests.'
    }
  ]

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Why choose Trusathi?
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We're dedicated to making your search safe, reliable, and community-focused.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
