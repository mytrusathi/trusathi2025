'use client'

import { useState } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Heart fill="currentColor" size={20} />
            </div>
            <span className="text-2xl font-bold text-indigo-900">Trusathi</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a className="text-gray-600 hover:text-indigo-600 font-medium">Browse Profiles</a>
            <a className="text-gray-600 hover:text-indigo-600 font-medium">Communities</a>
            <a className="text-gray-600 hover:text-indigo-600 font-medium">About Us</a>
            {!user && (
              <Link
                href="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
            )}
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium">
              Register Free
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <a className="block">Browse Profiles</a>
          <a className="block">Communities</a>
          <a className="block">About Us</a>
          {!user && (
            <Link
              href="/login"
              className="w-full bg-indigo-600 text-white py-2 roundedr"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}

          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Register Free
          </button>
        </div>
      )}
    </nav>
  )
}
