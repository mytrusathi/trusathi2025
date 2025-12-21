'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { loginWithEmail, user, role, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // 🔁 AUTO REDIRECT AFTER LOGIN
  useEffect(() => {
    if (loading) return

    if (user && role) {
      if (role === 'super-admin') {
        router.replace('/dashboard/super-admin')
      } else if (role === 'group-admin') {
        router.replace('/dashboard/group-admin')
      } else if (role === 'member') {
        router.replace('/dashboard/member')
      }
    }
  }, [user, role, loading, router])

  const handleLogin = async () => {
    setError('')
    try {
      await loginWithEmail(email, password)
      // 🚫 DO NOT redirect here
      // AuthContext + useEffect handles it
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  // ⏳ While checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="font-bold text-lg mb-4 text-center">Login</h1>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>
      </div>
    </div>
  )
}
