'use client'

import { Profile } from '@/types/profile'
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Edit3,
} from 'lucide-react'

interface Props {
  profile: Profile
  onBack: () => void
  onEdit: () => void
}

export default function ProfileDetail({ profile, onBack, onEdit }: Props) {
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4
                      shadow-2xl shadow-black/50 flex justify-between items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
            Profile Details
          </p>
          <p className="text-sm font-semibold text-slate-100 mt-1">
            {profile.name || '—'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {profile.age && `${profile.age} yrs`}
            {profile.gender && ` • ${profile.gender}`}
            {(profile.city || profile.pob) && ` • ${profile.city || profile.pob}`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[11px]
                       px-3 py-1.5 rounded-lg border border-slate-700
                       hover:border-slate-500 transition"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-[11px]
                       px-3 py-1.5 rounded-lg border border-indigo-500/60
                       text-indigo-300 hover:bg-indigo-500/10 transition"
          >
            <Edit3 size={14} />
            Edit
          </button>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <Section title="Personal Details">
        <Detail label="Age" value={profile.age} />
        <Detail label="Gender" value={profile.gender} />
        <Detail label="Height" value={profile.height} />
        <Detail icon={<Calendar size={13} />} label="DOB" value={profile.dob} />
        <Detail label="Birth Time" value={profile.tob} />
        <Detail icon={<MapPin size={13} />} label="Birth Place" value={profile.pob} />
        <Detail label="City" value={profile.city} />
        <Detail label="Diet" value={profile.diet} />
        <Detail label="Manglik" value={profile.manglik} />
      </Section>

      {/* PROFESSIONAL DETAILS */}
      <Section title="Professional Details">
        <Detail
          icon={<Briefcase size={13} />}
          label="Education"
          value={profile.education}
        />
        <Detail label="Profession" value={profile.profession} />
        <Detail label="Company" value={profile.company} />
        <Detail label="Income" value={profile.income} />
      </Section>

      {/* FAMILY DETAILS */}
      <Section title="Family Details">
        <Detail
          icon={<Users size={13} />}
          label="Father"
          value={profile.father}
          extra={profile.fatherOcc}
        />
        <Detail
          icon={<Users size={13} />}
          label="Mother"
          value={profile.mother}
          extra={profile.motherOcc}
        />
        <Detail label="Siblings" value={profile.siblings} />
        <Detail label="Caste / Gotra" value={
          profile.caste || profile.gotra
            ? `${profile.caste || ''}${profile.gotra ? ` • ${profile.gotra}` : ''}`
            : ''
        } />
        <Detail label="Address" value={profile.address} />
      </Section>

    </div>
  )
}

/* -----------------------------
   Reusable Components
------------------------------*/

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4
                    shadow-2xl shadow-black/50">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500
                    font-semibold mb-3">
        {title}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {children}
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  extra,
  icon,
}: {
  label: string
  value?: string
  extra?: string
  icon?: React.ReactNode
}) {
  if (!value && !extra) return null

  return (
    <div>
      <p className="text-[10px] uppercase text-slate-500 font-semibold
                    tracking-[0.12em] mb-0.5 flex items-center gap-1.5">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
      </p>
      <p className="text-xs text-slate-100">{value || '—'}</p>
      {extra && (
        <p className="text-[11px] text-slate-400 mt-0.5">{extra}</p>
      )}
    </div>
  )
}
