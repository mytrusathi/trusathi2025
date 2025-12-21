import { UserPlus } from 'lucide-react'

export default function GroupAdminCTA() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-indigo-900 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">

        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 md:flex items-center justify-between gap-12">

          {/* Text */}
          <div className="mb-8 md:mb-0 max-w-2xl">
            <span className="text-indigo-300 font-bold uppercase tracking-wider text-sm mb-2 block">
              For Community Leaders
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Do you manage a WhatsApp Group?
            </h2>

            <p className="text-indigo-100 text-lg">
              Become a <strong>Group Admin</strong> on Trusathi. Create profiles for your
              community members, manage visibility, and help them find trusted matches safely.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 whitespace-nowrap">
              <UserPlus size={20} />
              Create Admin Account
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
