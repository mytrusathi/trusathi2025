'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import ChangePasswordCard from '@/components/ChangePasswordCard'

interface PasswordChangeModalProps {
  closeHref: string
}

export default function PasswordChangeModal({ closeHref }: PasswordChangeModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <Link
          href={closeHref}
          className="absolute -top-2 -right-2 z-10 h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center"
          aria-label="Close change password window"
        >
          <X size={18} />
        </Link>
        <ChangePasswordCard />
      </div>
    </div>
  )
}
