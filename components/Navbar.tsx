'use client'

import { useState, useEffect } from 'react'
import { Heart, Menu, X, User, LogOut, ChevronDown, Bell, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21l7-7Z" fill="currentColor" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-indigo-900 leading-none">TruSathi</span>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5 animate-pulse">Service to Mankind</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLink href="/search">Browse Profiles</NavLink>
            <NavLink href="/communities">Communities</NavLink>
            <NavLink href="/success-stories">Mission</NavLink>
            <NavLink href="/support">Support</NavLink>

            <div className="h-6 w-px bg-slate-200 mx-4"></div>

            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm px-4"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 transform active:scale-95 text-sm"
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <NotificationBell />
                
                {/* User Dropdown Group */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100 group relative">
                   <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Welcome back,</p>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{user.displayName || 'User'}</p>
                   </div>
                   
                   {/* Trigger Button */}
                   <button className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                   </button>
                   
                   {/* Dropdown Menu - Added pt-2 to create a hover bridge */}
                   <div className="absolute right-0 top-full pt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2">
                         <div className="px-4 py-3 border-b border-slate-50 mb-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Account</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{user.email || user.displayName}</p>
                         </div>
                         
                         <DropdownLink href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'} icon={<LayoutDashboard size={16} />}>
                            My Dashboard
                         </DropdownLink>
                         
                         <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                            Account Settings
                         </DropdownLink>
                         
                         <div className="h-px bg-slate-50 my-2 mx-4"></div>
                         
                         <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 text-sm font-bold text-rose-600 transition-colors"
                         >
                            <LogOut size={16} /> Logout
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={18} />
               </div>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <MobileNavLink href="/search" onClick={closeMenu}>Browse Profiles</MobileNavLink>
          <MobileNavLink href="/communities" onClick={closeMenu}>Communities</MobileNavLink>
          <MobileNavLink href="/success-stories" onClick={closeMenu}>Our Mission</MobileNavLink>
          <MobileNavLink href="/support" onClick={closeMenu}>Help & FAQ</MobileNavLink>

          <div className="pt-6 border-t border-slate-100">
            {!user ? (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-4 rounded-2xl font-bold text-slate-600 bg-slate-50"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-4 rounded-2xl font-bold text-white bg-indigo-600"
                  onClick={closeMenu}
                >
                  Join TruSathi
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-center font-bold text-slate-800 mb-4">{user.displayName}</p>
                <Link
                  href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'}
                  className="block w-full text-center py-3 rounded-xl font-bold text-slate-700 bg-slate-50"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full text-center py-3 rounded-xl font-bold text-white bg-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all font-sans"
    >
      {children}
    </Link>
  )
}

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
   return (
      <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
         <span className="text-slate-400">{icon}</span>
         {children}
      </Link>
   );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-lg font-bold text-slate-700 py-2 border-b border-slate-50 flex items-center justify-between group"
      onClick={onClick}
    >
      {children}
      <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
    </Link>
  )
}
