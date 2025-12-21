'use client'

export default function ProfileDetail({ profile, onBack, onEdit }: any) {
  return (
    <div className="bg-slate-900 p-4 rounded space-y-3">
      <button onClick={onBack} className="text-xs text-slate-400">
        ← Back
      </button>

      <h2 className="text-lg font-semibold">{profile.name}</h2>
      <p className="text-sm text-slate-400">
        {profile.age} yrs • {profile.gender} • {profile.city}
      </p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Profession: {profile.profession}</div>
        <div>Education: {profile.education}</div>
        <div>Caste: {profile.caste}</div>
        <div>Manglik: {profile.manglik}</div>
      </div>

      <button
        onClick={() => onEdit(profile)}
        className="text-xs text-indigo-400"
      >
        Edit Profile
      </button>
    </div>
  )
}
