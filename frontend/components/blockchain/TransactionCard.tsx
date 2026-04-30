'use client'

import { truncateHash, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TransactionCardProps {
  hash: string
  type: string
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: string
  gasUsed?: number
  blockNumber?: number
}

export function TransactionCard({
  hash,
  type,
  status,
  timestamp,
  gasUsed,
  blockNumber,
}: TransactionCardProps) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className='border border-border rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <p className='text-sm font-mono text-muted-foreground'>{truncateHash(hash)}</p>
          <p className='text-xs text-muted-foreground mt-1'>{type}</p>
        </div>
        <Badge className={statusColors[status]}>{status}</Badge>
      </div>

      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div>
          <p className='text-xs text-muted-foreground'>Time</p>
          <p className='text-xs font-medium'>{formatDateTime(timestamp)}</p>
        </div>
        {blockNumber && (
          <div>
            <p className='text-xs text-muted-foreground'>Block</p>
            <p className='text-xs font-medium'>#{blockNumber}</p>
          </div>
        )}
        {gasUsed && (
          <div>
            <p className='text-xs text-muted-foreground'>Gas</p>
            <p className='text-xs font-medium'>{gasUsed.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
