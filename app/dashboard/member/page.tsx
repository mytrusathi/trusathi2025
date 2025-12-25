// app/dashboard/member/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '../../../context/AuthContext'
import { Profile } from '../../../types/profile'
import { Loader2, UserPlus, Edit3 } from 'lucide-react'
import ProfileForm from '../../../components/group-admin/ProfileForm' // Reusing your existing form!
import { ProfileCard } from '../../../components/group-admin/ProfileCard' // Reusing your existing card!

export default function MemberDashboard() {
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch the SINGLE profile belonging to this member
  const fetchMyProfile = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Find profile created by this user
      const q = query(collection(db, 'profiles'), where('createdBy', '==', user.uid))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const docData = snapshot.docs[0]
        setProfile({ id: docData.id, ...docData.data() } as Profile)
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProfile()
  }, [user])

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin text-rose-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    )
  }

  // 1. Show Form (Create or Edit)
  if (isEditing || !profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
           <h1 className="text-2xl font-bold text-slate-800">
             {profile ? 'Edit Your Profile' : 'Create Your Profile'}
           </h1>
           <p className="text-slate-500">
             {profile ? 'Update your details to find better matches.' : 'Complete your biodata to get started.'}
           </p>
        </div>

        <ProfileForm 
          initialData={profile}
          onSuccess={() => {
            setIsEditing(false)
            fetchMyProfile()
          }}
          onCancel={() => {
            // If they have a profile, go back to view. If not, stay here (or logout).
            if (profile) setIsEditing(false)
          }}
        />
      </div>
    )
  }

  // 2. Show Profile View (Default)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500">This is how your profile appears to others.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-md transition-all font-semibold"
        >
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      <div className="max-w-md">
         {/* Reuse the card we built earlier */}
         <ProfileCard 
            profile={profile}
            isCopied={false}
            onCopy={() => {}} // Member doesn't need to copy their own link usually
            onView={() => {}} // Already viewing
            onEdit={() => setIsEditing(true)}
            onDelete={() => alert("Members cannot delete their profile. Contact admin.")}
         />
      </div>
    </div>
  )
}