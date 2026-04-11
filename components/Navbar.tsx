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
      scrolled 
      ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2 border-b border-slate-100' 
      : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
               <Heart size={24} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tight leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>TruSathi</span>
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1.5 opacity-80 transition-colors ${scrolled ? 'text-indigo-600' : 'text-indigo-300'}`}>Protocol for Trust</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLink href="/search" scrolled={scrolled}>Browse Profiles</NavLink>
            <NavLink href="/communities" scrolled={scrolled}>Communities</NavLink>
            <NavLink href="/success-stories" scrolled={scrolled}>Mission</NavLink>
            <NavLink href="/support" scrolled={scrolled}>Support</NavLink>

            <div className={`h-6 w-px mx-4 transition-colors ${scrolled ? 'bg-slate-200' : 'bg-white/10'}`}></div>

            {!user ? (
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className={`font-black text-[11px] uppercase tracking-widest transition-colors px-4 ${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={`px-7 py-3.5 rounded-2x border transition-all transform active:scale-95 text-[11px] font-black uppercase tracking-widest shadow-xl ${
                    scrolled 
                    ? 'bg-slate-900 border-slate-900 text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-slate-200' 
                    : 'bg-white border-white text-slate-900 hover:bg-indigo-50 shadow-indigo-500/10'
                  }`}
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className={scrolled ? 'text-slate-600' : 'text-white'}>
                   <NotificationBell />
                </div>
                
                {/* User Dropdown Group */}
                <div className={`flex items-center gap-3 pl-4 border-l group relative ${scrolled ? 'border-slate-100' : 'border-white/10'}`}>
                   <div className="text-right hidden sm:block">
                      <p className={`text-[10px] font-black uppercase tracking-tighter opacity-60 ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>Welcome,</p>
                      <p className={`text-sm font-black truncate max-w-[120px] ${scrolled ? 'text-slate-800' : 'text-white'}`}>{user.displayName?.split(' ')[0] || 'Member'}</p>
                   </div>
                   
                   {/* Trigger Button */}
                   <button className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold overflow-hidden shadow-sm transition-transform group-hover:scale-105 ${
                     scrolled ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-white/10 border-white/20 text-white'
                   }`}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                   </button>
                   
                   {/* Dropdown Menu */}
                   <div className="absolute right-0 top-full pt-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
                      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden py-3">
                         <div className="px-6 py-4 border-b border-slate-50 mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                            <p className="text-sm font-black text-slate-900 truncate">{user.email || user.displayName}</p>
                         </div>
                         
                         <DropdownLink href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'} icon={<LayoutDashboard size={16} />}>
                            My Dashboard
                         </DropdownLink>
                         
                         <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                            Account Settings
                         </DropdownLink>
                         
                         <div className="h-px bg-slate-50 my-2 mx-6"></div>
                         
                         <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-rose-50 text-sm font-black text-rose-600 transition-colors"
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
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-8 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
             <MobileNavLink href="/search" onClick={closeMenu}>Browse Profiles</MobileNavLink>
             <MobileNavLink href="/communities" onClick={closeMenu}>Communities</MobileNavLink>
             <MobileNavLink href="/success-stories" onClick={closeMenu}>Our Mission</MobileNavLink>
             <MobileNavLink href="/support" onClick={closeMenu}>Help & FAQ</MobileNavLink>
          </div>

          <div className="pt-8 border-t border-slate-100">
            {!user ? (
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="block w-full text-center py-5 rounded-[1.5rem] font-black text-slate-600 bg-slate-50 text-xs uppercase tracking-widest"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-5 rounded-[1.5rem] font-black text-white bg-indigo-600 text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
                  onClick={closeMenu}
                >
                  Join TruSathi
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                         <User size={20} />
                      </div>
                      <p className="font-black text-slate-800">{user.displayName}</p>
                   </div>
                   <NotificationBell />
                </div>
                <Link
                  href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'}
                  className="block w-full text-center py-4 rounded-xl font-black text-slate-700 bg-slate-100 text-sm"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full text-center py-4 rounded-xl font-black text-white bg-rose-500 text-sm shadow-lg shadow-rose-100"
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

function NavLink({ href, children, scrolled }: { href: string, children: React.ReactNode, scrolled: boolean }) {
  return (
    <Link 
      href={href} 
      className={`px-5 py-2.5 text-[11px] font-black rounded-xl transition-all font-sans uppercase tracking-[0.15em] ${
        scrolled 
        ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50' 
        : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  )
}

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
   return (
      <Link href={href} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 text-sm font-black text-slate-700 transition-colors">
         <span className="text-slate-400">{icon}</span>
         {children}
      </Link>
   );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-xl font-black text-slate-800 py-3 border-b border-slate-50 flex items-center justify-between group"
      onClick={onClick}
    >
      {children}
      <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-indigo-500 transition-colors" size={24} />
    </Link>
  )
}
