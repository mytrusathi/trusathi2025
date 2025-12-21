'use client'

import { Profile } from '@/types/profile'
import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'

import ProfileList from 'components/group-admin/ProfileList'
import ProfileDetail from 'components/group-admin/ProfileDetail'
import ProfileForm from 'components/group-admin/ProfileForm'
import GroupAdminLayout from 'components/group-admin/GroupAdminLayout'

export default function GroupAdminDashboardPage() {
  const { user } = useAuth()

  const [view, setView] = useState<'list' | 'detail' | 'add' | 'edit'>('list')
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState<any>(null)

  return (
    <ProtectedRoute allowedRoles={['group-admin']}>
      <GroupAdminLayout>
        {view === 'list' && (
          <ProfileList
            user={user}
            onAdd={() => setView('add')}
            onView={(p:Profile) => {
              setSelectedProfile(p)
              setView('detail')
            }}
            onEdit={(p:Profile) => {
              setEditingProfile(p)
              setView('edit')
            }}
          />
        )}

        {view === 'detail' && selectedProfile && (
          <ProfileDetail
            profile={selectedProfile}
            onBack={() => {
              setSelectedProfile(null)
              setView('list')
            }}
            onEdit={(p: Profile) => {
              setEditingProfile(p)
              setView('edit')
            }}
          />
        )}

        {(view === 'add' || view === 'edit') && (
          <ProfileForm
            user={user}
            initialData={editingProfile}
            onCancel={() => {
              setEditingProfile(null)
              setView('list')
            }}
            onSaved={() => {
              setEditingProfile(null)
              setView('list')
            }}
          />
        )}

      </GroupAdminLayout>

    </ProtectedRoute>
  )
}
