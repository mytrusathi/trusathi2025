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

  const closeMenu =() => setIsMenuOpen(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href ="/"
           className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Heart fill="currentColor" size={20} />
            </div>
            <span className="text-2xl font-bold text-indigo-900">TruSathi</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href ="/search"
             className="text-gray-600 hover:text-indigo-600 font-medium">
              Browse Profiles
              </Link>

            <a className="text-gray-600 hover:text-indigo-600 font-medium">Communities</a>
            
            <Link href="/about"
            className="text-gray-600 hover:text-indigo-600 font-medium">
              About Us
              </Link>

            {!user && (
              <Link
                href="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
            )}
            {!user && (
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium"
              >
                Register Free
              </Link>
            )}
        
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
          <Link
          href="/search"
          className="block text-gray-700 font-medium py-2"
          onClick={closeMenu}>
            Browse Profiles
            </Link>

          <Link 
          href="/#communities"
          className="block text-gray-700 font-medium py-2"
          onClick={closeMenu}>
            Communities
            </Link>

          <Link
          href="/about" 
          className="block text-gray-700 font-medium py-2"
          onClick={closeMenu}>
            About Us
            </Link>

          {!user && (
            <Link
              href="/login"
              className="w-full bg-indigo-600 text-white py-2 roundedr"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
          href="/register"
          className="block w-full text-center bg-indigo-600 text-white py-2 rounded"
          onClick={()=>setIsMenuOpen(false)}>
            Register Free
          </Link>
          
        </div>
      )}
    </nav>
  )
}
