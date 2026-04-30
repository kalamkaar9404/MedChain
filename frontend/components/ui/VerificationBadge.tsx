'use client'

import { Badge } from '@/components/ui/badge'

interface VerificationBadgeProps {
  status: 'VERIFIED' | 'PENDING' | 'FAILED' | 'NOT_SUBMITTED'
  verification_date?: string
}

const STATUS_STYLES = {
  VERIFIED: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
  NOT_SUBMITTED: { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100' },
}

export function VerificationBadge({ status, verification_date }: VerificationBadgeProps) {
  const styles = STATUS_STYLES[status]

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${styles.bg}`}>
      <Badge className={`${styles.badge} ${styles.text}`} variant='outline'>
        {status.replace('_', ' ')}
      </Badge>
      {verification_date && <span className='text-xs text-slate-600'>{new Date(verification_date).toLocaleDateString()}</span>}
    </div>
  )
}
