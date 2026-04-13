'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Settings, Handshake } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
      ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
      : 'py-6 bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 active:scale-95 transition-transform" onClick={closeMenu}>
            <div className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ${scrolled ? 'bg-primary text-primary-foreground rotate-0' : 'bg-primary/10 text-primary rotate-[-10deg] group-hover:rotate-0'
              }`}>
              <Handshake size={24} className="animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none text-foreground transition-colors">
                truSathi
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none mt-1 text-muted-foreground transition-colors">
                Honesty First
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/search" scrolled={scrolled}>Browse</NavLink>
            <NavLink href="/communities" scrolled={scrolled}>Communities</NavLink>
            <NavLink href="/success-stories" scrolled={scrolled}>Stories</NavLink>
            
            <div className="h-6 w-px bg-border/20 mx-4 hidden lg:block" />

            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-7 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 bg-primary text-primary-foreground hover:shadow-primary/20 hover:bg-primary/90"
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <NotificationBell />

                  <div className="flex items-center gap-3 pl-4 border-l border-border group relative">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Member</p>
                      <p className="text-xs font-black truncate max-w-[100px] text-foreground">{user.displayName?.split(' ')[0] || 'User'}</p>
                    </div>

                    <button className="w-10 h-10 rounded-full border-2 border-border bg-muted transition-all group-hover:scale-105 active:scale-95 overflow-hidden">
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="P" width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground">
                          <User size={18} />
                        </div>
                      )}
                    </button>

                    {/* Enhanced Dropdown */}
                    <div className="absolute right-0 top-full pt-3 w-64 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                      <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden py-2 backdrop-blur-xl">
                        <div className="px-6 py-4 border-b border-border/50 mb-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Authenticated Account</p>
                          <p className="text-sm font-black text-foreground truncate">{user.email || user.displayName}</p>
                        </div>

                        <DropdownLink href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'} icon={<LayoutDashboard size={16} />}>
                          Dashboard
                        </DropdownLink>

                        <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                          Settings
                        </DropdownLink>

                        <div className="h-px bg-border my-2 mx-6"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-destructive/10 text-sm font-black text-destructive transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-xl transition-all active:scale-90 ${scrolled ? 'bg-muted text-foreground' : 'bg-white/10 text-white'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-500 overflow-y-auto max-h-[90vh]">
          <div className="grid gap-2">
            <MobileNavLink href="/search" onClick={closeMenu}>Browse Profiles</MobileNavLink>
            <MobileNavLink href="/communities" onClick={closeMenu}>Communities</MobileNavLink>
            <MobileNavLink href="/success-stories" onClick={closeMenu}>Success Stories</MobileNavLink>
            <MobileNavLink href="/support" onClick={closeMenu}>Support Desk</MobileNavLink>
          </div>

          <div className="pt-6 border-t border-border">
            {!user ? (
              <div className="grid gap-3">
                <Link
                  href="/login"
                  className="w-full text-center py-4 rounded-2xl font-black text-foreground bg-muted text-xs uppercase tracking-widest border border-border"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-4 rounded-2xl font-black text-primary-foreground bg-primary text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                  onClick={closeMenu}
                >
                  Join TruSathi
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-2xl mb-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Member</p>
                      <p className="font-black text-foreground">{user.displayName}</p>
                    </div>
                  </div>
                  <NotificationBell />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'}
                    className="w-full text-center py-4 rounded-xl font-black text-foreground bg-muted border border-border text-xs uppercase tracking-wider"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); closeMenu(); }}
                    className="w-full text-center py-4 rounded-xl font-black text-white bg-destructive text-xs uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
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
      className="px-5 py-2.5 text-[11px] font-black rounded-xl transition-all font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {children}
    </Link>
  )
}

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted text-sm font-black text-foreground transition-colors text-left">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-xl font-black text-foreground py-3 border-b border-border flex items-center justify-between group text-left"
      onClick={onClick}
    >
      {children}
      <ChevronDown className="-rotate-90 text-muted-foreground group-hover:text-primary transition-colors" size={24} />
    </Link>
  )
}