'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type AllowedRole = 'super-admin' | 'group-admin' | 'member'

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: AllowedRole[]
}) {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Not logged in
    if (!user) {
      router.replace('/login')
      return
    }

    // Logged in but wrong role
    if (role && !allowedRoles.includes(role)) {
      router.replace('/')
    }
  }, [user, role, loading, router, allowedRoles])

  // While checking auth → show nothing
  if (loading) return null

  // If logged in & allowed
  if (user && role && allowedRoles.includes(role)) {
    return <>{children}</>
  }

  return null
}
