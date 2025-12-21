'use client'

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { loginWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password)
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="font-bold text-lg mb-4">Login</h1>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  )
}
