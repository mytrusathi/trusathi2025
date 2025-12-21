'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'

export default function GroupAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['group-admin']}>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Group Admin Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}
