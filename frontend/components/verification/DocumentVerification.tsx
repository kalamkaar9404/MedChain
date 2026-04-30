'use client'

import { format, parseISO } from 'date-fns'

interface DocumentVerificationProps {
  documentId: string
  type: string
  verificationStatus: 'verified' | 'pending' | 'rejected'
  uploadDate: string
  verifiedBy?: string
  flags?: string[]
}

export function DocumentVerification({
  documentId,
  type,
  verificationStatus,
  uploadDate,
  verifiedBy,
  flags,
}: DocumentVerificationProps) {
  const statusStyles = {
    verified: 'bg-green-50 border-green-200',
    pending: 'bg-yellow-50 border-yellow-200',
    rejected: 'bg-red-50 border-red-200',
  }

  const statusText = {
    verified: 'text-green-700',
    pending: 'text-yellow-700',
    rejected: 'text-red-700',
  }

  return (
    <div className={`border rounded-lg p-3 ${statusStyles[verificationStatus]}`}>
      <div className='flex items-start justify-between mb-2'>
        <div>
          <p className='text-sm font-medium'>{type}</p>
          <p className='text-xs text-muted-foreground'>{documentId}</p>
        </div>
        <span className={`text-xs font-semibold uppercase ${statusText[verificationStatus]}`}>
          {verificationStatus}
        </span>
      </div>

      <div className='text-xs text-muted-foreground mb-2'>
        {format(parseISO(uploadDate), 'MMM dd, yyyy HH:mm')}
      </div>

      {verifiedBy && (
        <p className='text-xs mb-2'>
          <span className='font-medium'>Verified by:</span> {verifiedBy}
        </p>
      )}

      {flags && flags.length > 0 && (
        <div className='mt-2'>
          <p className='text-xs font-medium mb-1'>Flags:</p>
          <ul className='text-xs space-y-1'>
            {flags.map((flag, idx) => (
              <li key={idx}>• {flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
