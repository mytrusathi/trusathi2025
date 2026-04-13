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
      ? 'bg-card p-4 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-primary/20 max-w-6xl mx-auto border border-border'
      : 'bg-card p-4 rounded-3xl shadow-xl shadow-primary/5 max-w-6xl mx-auto border border-border'
  return (
    <div className={containerClassName}>
      <div className={`grid grid-cols-1 ${variant === 'embedded' ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-4'} gap-4 items-end`}>

        {/* Looking For */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Looking For</label>
          <div className="relative">
            <select
              className="w-full p-4 bg-muted/50 border border-border rounded-2xl appearance-none font-bold text-foreground focus:ring-4 focus:ring-accent/10 focus:border-accent/20 outline-none transition-all cursor-pointer"
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
            <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Age Range</label>
          <div className="flex gap-2">
            <select
              className="w-1/2 p-4 bg-muted/50 border border-border rounded-2xl font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/10 cursor-pointer"
              value={searchData.ageMin}
              onChange={(e) => setSearchData({ ...searchData, ageMin: e.target.value })}
            >
              {AGE_OPTIONS.map((n) => (
                <option key={`min-${n}`}>{n}</option>
              ))}
            </select>
            <select
              className="w-1/2 p-4 bg-muted/50 border border-border rounded-2xl font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/10 cursor-pointer"
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
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Community</label>
          <div className="relative">
            <select
              className="w-full p-4 bg-muted/50 border border-border rounded-2xl appearance-none font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/10 cursor-pointer"
              value={searchData.community}
              onChange={(e) => setSearchData({ ...searchData, community: e.target.value })}
            >
              {COMMUNITIES.map((community) => (
                <option key={community}>{community}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        {/* Optional Filters for Embedded */}
        {variant === 'embedded' && (
          <>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Occupation</label>
              <select
                className="w-full p-4 bg-muted/50 border border-border rounded-2xl font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/10 cursor-pointer"
                value={searchData.occupation}
                onChange={(e) => setSearchData({ ...searchData, occupation: e.target.value })}
              >
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Education</label>
              <input
                className="w-full p-4 bg-muted/50 border border-border rounded-2xl font-bold text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-4 focus:ring-accent/10"
                placeholder="e.g. MBA"
                value={searchData.education}
                onChange={(e) => setSearchData({ ...searchData, education: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/10 transition-all active:scale-95 group border border-primary/20"
        >
          <Search size={20} className="group-hover:scale-110 transition-transform text-accent" />
          <span className="uppercase tracking-widest text-[11px]">Find Matches</span>
        </button>
      </div>
    </div>
  )
}