'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, ChevronDown } from 'lucide-react'

type SearchFilters = {
  lookingFor: 'Bride' | 'Groom'
  ageMin: string
  ageMax: string
  community: string
  occupation: string
  education: string
}

type SearchBarProps = {
  initialFilters?: Partial<SearchFilters>
  variant?: 'floating' | 'embedded'
}

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(i + 18))
const COMMUNITIES = [
  'All Communities',
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Jain',
]

const OCCUPATIONS = ['All', 'Govt', 'Private', 'Business', 'Professional', 'Self-Employed']

export default function SearchBar({ initialFilters, variant = 'floating' }: SearchBarProps) {
  const router = useRouter()

  const defaults = useMemo<SearchFilters>(
    () => ({
      lookingFor: initialFilters?.lookingFor ?? 'Bride',
      ageMin: initialFilters?.ageMin ?? '21',
      ageMax: initialFilters?.ageMax ?? '35',
      community: initialFilters?.community ?? 'All Communities',
      occupation: initialFilters?.occupation ?? 'All',
      education: initialFilters?.education ?? '',
    }),
    [initialFilters],
  )

  const [searchData, setSearchData] = useState<SearchFilters>(defaults)

  const handleSearch = () => {
    const min = Number(searchData.ageMin)
    const max = Number(searchData.ageMax)

    const params = new URLSearchParams({
      role: searchData.lookingFor,
      minAge: String(Math.min(min, max)),
      maxAge: String(Math.max(min, max)),
      community: searchData.community,
      occupation: searchData.occupation,
      education: searchData.education,
    })

    router.push(`/search?${params.toString()}`)
  }

  // Updated container styling for TruSathi theme
  const containerClassName =
    variant === 'floating'
      ? 'bg-white p-4 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] max-w-6xl mx-auto border border-slate-100' // translate-y-12 hata diya
      : 'bg-white p-4 rounded-3xl shadow-xl max-w-6xl mx-auto border border-slate-100'
  return (
    <div className={containerClassName}>
      <div className={`grid grid-cols-1 ${variant === 'embedded' ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-4'} gap-4 items-end`}>

        {/* Looking For */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Looking For</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-bold text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/20 outline-none transition-all cursor-pointer"
              value={searchData.lookingFor}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  lookingFor: e.target.value as SearchFilters['lookingFor'],
                })
              }
            >
              <option>Bride</option>
              <option>Groom</option>
            </select>
            <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Age Range</label>
          <div className="flex gap-2">
            <select
              className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
              value={searchData.ageMin}
              onChange={(e) => setSearchData({ ...searchData, ageMin: e.target.value })}
            >
              {AGE_OPTIONS.map((n) => (
                <option key={`min-${n}`}>{n}</option>
              ))}
            </select>
            <select
              className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
              value={searchData.ageMax}
              onChange={(e) => setSearchData({ ...searchData, ageMax: e.target.value })}
            >
              {AGE_OPTIONS.map((n) => (
                <option key={`max-${n}`}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Community */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Community</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
              value={searchData.community}
              onChange={(e) => setSearchData({ ...searchData, community: e.target.value })}
            >
              {COMMUNITIES.map((community) => (
                <option key={community}>{community}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Optional Filters for Embedded */}
        {variant === 'embedded' && (
          <>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Occupation</label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                value={searchData.occupation}
                onChange={(e) => setSearchData({ ...searchData, occupation: e.target.value })}
              >
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Education</label>
              <input
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-amber-500/10"
                placeholder="e.g. MBA"
                value={searchData.education}
                onChange={(e) => setSearchData({ ...searchData, education: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Search Button - Updated to Navy/Gold theme */}
        <button
          onClick={handleSearch}
          className="h-14 bg-slate-900 hover:bg-black text-amber-500 font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/5 transition-all active:scale-95 group"
        >
          <Search size={20} className="group-hover:scale-110 transition-transform" />
          <span className="uppercase tracking-widest text-xs">Find Matches</span>
        </button>
      </div>
    </div>
  )
}