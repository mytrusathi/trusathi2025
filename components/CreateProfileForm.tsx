'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from 'app/lib/firebase'
import { useAuth } from '../context/AuthContext'

export default function CreateProfileForm() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    profession: '',
    location: '',
    community: '',
    contactNumber: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!user) return alert('Not authenticated')

    try {
      await addDoc(collection(db, 'profiles'), {
        ...form,
        age: Number(form.age),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        visibility: 'public',
      })

      alert('Profile created successfully')

      setForm({
        name: '',
        age: '',
        gender: '',
        height: '',
        profession: '',
        location: '',
        community: '',
        contactNumber: '',
      })
    } catch (error) {
      console.error(error)
      alert('Failed to create profile')
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Create New Profile</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={(form as any)[key]}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Create Profile
      </button>
    </div>
  )
}
