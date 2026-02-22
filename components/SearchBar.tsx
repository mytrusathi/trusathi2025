'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, ChevronDown } from 'lucide-react'

type SearchFilters = {
  lookingFor: 'Bride' | 'Groom'
  ageMin: string
  ageMax: string
  community: string
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

export default function SearchBar({ initialFilters, variant = 'floating' }: SearchBarProps) {
  const router = useRouter()

  const defaults = useMemo<SearchFilters>(
    () => ({
      lookingFor: initialFilters?.lookingFor ?? 'Bride',
      ageMin: initialFilters?.ageMin ?? '21',
      ageMax: initialFilters?.ageMax ?? '35',
      community: initialFilters?.community ?? 'All Communities',
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
    })

    router.push(`/search?${params.toString()}`)
  }

  const containerClassName =
    variant === 'floating'
      ? 'bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-5xl mx-auto transform translate-y-12 border border-gray-100'
      : 'bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-5xl mx-auto border border-gray-100'

  return (
    <div className={containerClassName}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Looking For</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-50 border rounded-xl appearance-none"
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
            <Users size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age Range</label>
          <div className="flex gap-2">
            <select
              className="w-1/2 p-3 bg-gray-50 border rounded-xl"
              value={searchData.ageMin}
              onChange={(e) => setSearchData({ ...searchData, ageMin: e.target.value })}
            >
              {AGE_OPTIONS.map((n) => (
                <option key={`min-${n}`}>{n}</option>
              ))}
            </select>
            <select
              className="w-1/2 p-3 bg-gray-50 border rounded-xl"
              value={searchData.ageMax}
              onChange={(e) => setSearchData({ ...searchData, ageMax: e.target.value })}
            >
              {AGE_OPTIONS.map((n) => (
                <option key={`max-${n}`}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Community</label>
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-50 border rounded-xl appearance-none"
              value={searchData.community}
              onChange={(e) => setSearchData({ ...searchData, community: e.target.value })}
            >
              {COMMUNITIES.map((community) => (
                <option key={community}>{community}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Find Matches
        </button>
      </div>
    </div>
  )
}
