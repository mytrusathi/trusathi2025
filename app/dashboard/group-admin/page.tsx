'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import GroupAdminLayout from '@/components/group-admin/GroupAdminLayout'
import ProfileList from '@/components/group-admin/ProfileList'
import ProfileForm from '@/components/group-admin/ProfileForm'
import ProfileDetail from '@/components/group-admin/ProfileDetail'
import { Profile } from '@/types/profile'

type ViewType = 'list' | 'add' | 'edit' | 'detail'

export default function GroupAdminPage() {
  const { user } = useAuth()

  const [view, setView] = useState<ViewType>('list')
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  return (
    <ProtectedRoute allowedRoles={['group-admin']}>
      <GroupAdminLayout>

        {/* LIST VIEW */}
        {view === 'list' && (
          <ProfileList
            user={user}
            onAdd={() => {
              setSelectedProfile(null)
              setView('add')
            }}
            onView={(p: Profile) => {
              setSelectedProfile(p)
              setView('detail')
            }}
            onEdit={(p: Profile) => {
              setSelectedProfile(p)
              setView('edit')
            }}
          />
        )}

        {/* ADD PROFILE */}
        {view === 'add' && (
          <ProfileForm
            initialData={null}
            onCancel={() => setView('list')}
            onSaved={() => setView('list')}
          />
        )}

        {/* EDIT PROFILE */}
        {view === 'edit' && selectedProfile && (
          <ProfileForm
            initialData={selectedProfile}
            onCancel={() => setView('list')}
            onSaved={() => setView('list')}
          />
        )}

        {/* DETAIL VIEW */}
        {view === 'detail' && selectedProfile && (
          <ProfileDetail
            profile={selectedProfile}
            onBack={() => {
              setSelectedProfile(null)
              setView('list')
            }}
            onEdit={() => setView('edit')}
          />
        )}

      </GroupAdminLayout>
    </ProtectedRoute>
  )
}
