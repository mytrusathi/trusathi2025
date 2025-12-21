'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'

export default function SuperAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}
