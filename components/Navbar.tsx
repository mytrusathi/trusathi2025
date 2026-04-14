'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Settings, Handshake, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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
    <div className={`fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 transition-all duration-700 pointer-events-none ${scrolled ? 'pt-4' : 'pt-6'}`}>
      <nav className={`mx-auto max-w-7xl pointer-events-auto transition-all duration-700 glass-effect ${scrolled
        ? 'rounded-[2rem] px-6 py-3 shadow-lift border-primary/10'
        : 'rounded-none border-transparent px-2 py-2 bg-transparent backdrop-blur-0'
        }`}>
        <div className="flex items-center justify-between">
          <Logo size="lg" className="md:size-xl" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/search">Browse</NavLink>
            <NavLink href="/communities">Communities</NavLink>
            <NavLink href="/success-stories">Stories</NavLink>

            <div className="h-6 w-px bg-border/40 mx-4 hidden lg:block" />

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-premium active:scale-95 bg-primary text-white hover:bg-primary/90 hover:shadow-lift"
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <NotificationBell />

                  <div className="flex items-center gap-3 pl-4 border-l border-border/50 group relative cursor-pointer">
                    <div className="text-right hidden sm:block">
                      <p className="text-[8px] font-black uppercase tracking-wider text-accent leading-none mb-1">Authenticated</p>
                      <p className="text-xs font-black truncate max-w-[100px] text-foreground leading-none">{user.displayName?.split(' ')[0] || 'Member'}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full border-2 border-border/50 p-0.5 group-hover:border-primary transition-all overflow-hidden bg-secondary shadow-sm">
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="P" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <User size={18} />
                        </div>
                      )}
                    </div>

                    {/* Enhanced Dropdown */}
                    <div className="absolute right-0 top-full pt-4 w-64 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 z-[100]">
                      <div className="bg-card rounded-[2rem] shadow-lift border border-border/50 overflow-hidden py-3 backdrop-blur-2xl">
                        <div className="px-6 py-4 border-b border-border/30 mb-2">
                          <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Sparkles size={10} /> Account
                          </p>
                          <p className="text-sm font-black text-foreground truncate">{user.email || user.displayName}</p>
                        </div>

                        <DropdownLink href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'} icon={<LayoutDashboard size={16} />}>
                          Dashboard
                        </DropdownLink>

                        <DropdownLink href="/dashboard/settings" icon={<Settings size={16} />}>
                          Account Settings
                        </DropdownLink>

                        <div className="h-px bg-border/30 my-2 mx-6"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-destructive/5 text-sm font-black text-destructive transition-colors text-left"
                        >
                          <LogOut size={16} /> Secure Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-1 rounded-xl glass-effect text-foreground active:scale-90 transition-all shadow-sm"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 space-y-6 animate-in slide-in-from-top-4 duration-500 overflow-y-auto max-h-[70vh]">
            <div className="grid gap-1 px-2">
              <MobileNavLink href="/search" onClick={closeMenu}>Browse Profiles</MobileNavLink>
              <MobileNavLink href="/communities" onClick={closeMenu}>Communities</MobileNavLink>
              <MobileNavLink href="/success-stories" onClick={closeMenu}>Success Stories</MobileNavLink>
              <MobileNavLink href="/support" onClick={closeMenu}>Support Desk</MobileNavLink>
            </div>

            <div className="pt-6 border-t border-border/30 px-2">
              {!user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="flex-1 text-center py-4 rounded-2xl font-black text-foreground bg-secondary text-[10px] uppercase tracking-widest border border-border/30"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center py-4 rounded-2xl font-black text-white bg-primary text-[10px] uppercase tracking-widest shadow-lift"
                    onClick={closeMenu}
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-[1.5rem] mb-4 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-premium">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-accent uppercase flex items-center gap-1">Authenticated</p>
                        <p className="font-black text-foreground text-sm">{user.displayName}</p>
                      </div>
                    </div>
                    <NotificationBell />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={user.role === 'member' ? '/dashboard/member' : '/dashboard/group-admin'}
                      className="w-full text-center py-4 rounded-xl font-black text-foreground bg-secondary border border-border/30 text-[10px] uppercase tracking-wider"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); closeMenu(); }}
                      className="w-full text-center py-4 rounded-xl font-black text-white bg-destructive text-[10px] uppercase tracking-wider shadow-sm"
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
    </div>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-[11px] font-black rounded-xl transition-all uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 active:scale-95"
    >
      {children}
    </Link>
  )
}

function DropdownLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-6 py-3.5 hover:bg-primary/5 text-sm font-black text-foreground transition-all text-left hover:pl-8 group">
      <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-lg font-black text-foreground py-4 border-b border-border/10 flex items-center justify-between group text-left px-2"
      onClick={onClick}
    >
      {children}
      <ChevronDown className="-rotate-90 text-muted-foreground group-hover:text-primary transition-colors" size={20} />
    </Link>
  )
}