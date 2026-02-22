import { Shield, ChevronRight, Users } from 'lucide-react'

type HomeProfile = {
  job?: string
  location?: string
  verifiedBy?: string
}

export default function ProfileCard({ profile }: { profile: HomeProfile }) {
  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Users size={48} className="opacity-20" />
      </div>

      <div className="p-6">
        <h3 className="font-bold">{profile.job}</h3>
        <p className="text-sm text-gray-500">{profile.location}</p>

        <div className="bg-indigo-50 mt-4 p-3 rounded flex gap-2">
          <Shield className="text-indigo-600" size={18} />
          <span className="text-sm">{profile.verifiedBy}</span>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
        <span className="text-sm">View Profile</span>
        <ChevronRight size={16} />
      </div>
    </div>
  )
}
