'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClaimDetailProps {
  claimId: string
  patientName: string
  amount: number
  status: string
  documents: { name: string; verified: boolean }[]
  auditNotes?: string
}

export function ClaimDetail({
  claimId,
  patientName,
  amount,
  status,
  documents,
  auditNotes,
}: ClaimDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='border border-border rounded-lg overflow-hidden'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full px-4 py-3 bg-card hover:bg-secondary transition-colors flex items-center justify-between'
      >
        <div className='text-left'>
          <p className='font-medium text-sm'>{claimId}</p>
          <p className='text-xs text-muted-foreground'>{patientName}</p>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform', isExpanded && 'transform rotate-180')}
        />
      </button>

      {isExpanded && (
        <div className='px-4 py-3 border-t border-border bg-card/50'>
          <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
            <div>
              <p className='text-xs text-muted-foreground'>Claim Amount</p>
              <p className='font-medium'>${amount.toLocaleString()}</p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>Status</p>
              <p className='font-medium'>{status}</p>
            </div>
          </div>

          {documents.length > 0 && (
            <div className='mb-4'>
              <p className='text-xs font-semibold mb-2'>Documents</p>
              <div className='space-y-1'>
                {documents.map((doc) => (
                  <div key={doc.name} className='flex items-center text-xs'>
                    <span className={cn('w-2 h-2 rounded-full mr-2', doc.verified ? 'bg-green-500' : 'bg-yellow-500')} />
                    {doc.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {auditNotes && (
            <div>
              <p className='text-xs font-semibold mb-1'>Audit Notes</p>
              <p className='text-xs text-muted-foreground'>{auditNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
