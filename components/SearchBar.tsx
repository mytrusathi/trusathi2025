'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, ChevronRight } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    lookingFor: 'Bride',
    ageMin: '21',
    ageMax: '35',
    community: 'All Communities'
  })
 
  const handleSearch = () => {
    // Construct query params
    const params = new URLSearchParams({
      role: searchData.lookingFor,
      minAge: searchData.ageMin,
      maxAge: searchData.ageMax,
      community: searchData.community
    })
    // Redirect to a search page (you need to create app/search/page.tsx later)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-5xl mx-auto transform translate-y-12 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        {/* Looking For */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Looking For
          </label>
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-50 border rounded-xl"
              value={searchData.lookingFor}
              onChange={(e) =>
                setSearchData({ ...searchData, lookingFor: e.target.value })
              }
            >
              <option>Bride</option>
              <option>Groom</option>
            </select>
            <Users
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Age Range
          </label>
          <div className="flex gap-2">
            <select className="w-1/2 p-3 bg-gray-50 border rounded-xl">
              {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <select className="w-1/2 p-3 bg-gray-50 border rounded-xl">
              {[30, 31, 32, 33, 34, 35].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Community */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Community
          </label>
          <div className="relative">
            <select className="w-full p-3 bg-gray-50 border rounded-xl">
              <option>All Communities</option>
              <option>Hindu</option>
              <option>Muslim</option>
              <option>Christian</option>
              <option>Sikh</option>
              <option>Jain</option>
            </select>
            <ChevronRight
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
            />
          </div>
        </div>

        {/* Button */}
        <button 
        onClick={handleSearch}
        className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          <Search size={18} />
          Find Matches
        </button>

      </div>
    </div>
  )
}
