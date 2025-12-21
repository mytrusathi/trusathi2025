'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'
import CreateProfileForm from '../../../components/CreateProfileForm'

export default function GroupAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['group-admin']}>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Group Admin Dashboard</h1>

        <CreateProfileForm />
      </div>
    </ProtectedRoute>
  )
}
