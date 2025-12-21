'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'

export default function MemberDashboard() {
  return (
    <ProtectedRoute allowedRoles={['member']}>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}
