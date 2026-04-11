'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  reload,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../app/lib/firebase'
import { AppUser } from '@/types/appUser'

/* -----------------------------
   Types
------------------------------*/

type UserRole = 'super-admin' | 'group-admin' | 'member' | null

interface AuthContextType {
  user: AppUser | null
  role: UserRole
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

/* -----------------------------
   Context
------------------------------*/

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* -----------------------------
   Provider
------------------------------*/

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          if (isMounted) {
            setUser(null)
            setRole(null)
            setLoading(false)
          }
          return
        }

        // 🔥 Fetch Firestore user ONCE
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        const appUser: AppUser = {
          ...(firebaseUser as AppUser),
          role: userSnap.exists() ? userSnap.data().role : null,
          groupName: userSnap.exists() ? userSnap.data().groupName : null,
          groupId: userSnap.exists() ? userSnap.data().groupId : null,
          slug: userSnap.exists() ? userSnap.data().slug : null,
          isApproved: userSnap.exists() ? userSnap.data().isApproved : undefined,
        }

        if (isMounted) {
          setUser(appUser)
          setRole(appUser.role ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        if (isMounted) {
          setUser(null)
          setRole(null)
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  /* -----------------------------
     Auth Functions
  ------------------------------*/

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const refreshUser = async () => {
    if (!auth.currentUser) return

    await reload(auth.currentUser)
    const refreshedUser = auth.currentUser
    if (!refreshedUser) return

    const userRef = doc(db, 'users', refreshedUser.uid)
    const userSnap = await getDoc(userRef)

    const appUser: AppUser = {
      ...(refreshedUser as AppUser),
      role: userSnap.exists() ? userSnap.data().role : null,
      groupName: userSnap.exists() ? userSnap.data().groupName : null,
      groupId: userSnap.exists() ? userSnap.data().groupId : null,
      slug: userSnap.exists() ? userSnap.data().slug : null,
      isApproved: userSnap.exists() ? userSnap.data().isApproved : undefined,
    }

    setUser(appUser)
    setRole(appUser.role ?? null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginWithEmail,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* -----------------------------
   Hook
------------------------------*/

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
