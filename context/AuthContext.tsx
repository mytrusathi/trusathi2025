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
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../app/lib/firebase'

/* -----------------------------
   Types
------------------------------*/

type UserRole = 'super-admin' | 'group-admin' | 'member' | null

interface AuthContextType {
  user: User | null
  role: UserRole
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

/* -----------------------------
   Context
------------------------------*/

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* -----------------------------
   Provider
------------------------------*/

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  let isMounted = true

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (!isMounted) return

      if (firebaseUser) {
        setUser(firebaseUser)

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            setRole(userDocSnap.data().role as UserRole)
          } else {
            setRole(null)
          }
        } catch (firestoreError) {
          console.error('Firestore role fetch failed:', firestoreError)
          setRole(null)
        }
      } else {
        setUser(null)
        setRole(null)
      }
    } catch (authError) {
      console.error('Auth state error:', authError)
      setUser(null)
      setRole(null)
    } finally {
      if (isMounted) {
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

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginWithEmail,
        logout,
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
