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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass-effect shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
               <Heart size={24} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">TruSathi</span>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1 opacity-80">Service to Mankind</span>
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
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm px-4"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-black transition-all shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] transform active:scale-95 text-sm uppercase tracking-widest"
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
      className="px-5 py-2.5 text-xs font-black text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all font-sans uppercase tracking-[0.1em]"
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
