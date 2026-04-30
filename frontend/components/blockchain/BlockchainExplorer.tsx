'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, ExternalLink } from 'lucide-react'
import { truncateHash, timeAgo } from '@/lib/utils'

interface BlockchainState {
  claim_id: string
  verification_hash: string
  auditor_hash: string
  timestamp: string
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED'
  transaction_count: number
}

export function BlockchainExplorer({ claims }: { claims: BlockchainState[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = claims.filter(
    (claim) =>
      claim.claim_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.verification_hash.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50'
      case 'FLAGGED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Explorer</CardTitle>
        <CardDescription>Search and verify claim transactions on the blockchain</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search claim ID or hash...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-8'
            />
          </div>
          <Button variant='outline'>Export</Button>
        </div>

        <div className='space-y-2 max-h-96 overflow-y-auto'>
          {filtered.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>No transactions found</div>
          ) : (
            filtered.map((claim) => (
              <div
                key={claim.claim_id}
                className='border rounded-lg p-3 hover:bg-slate-50 cursor-pointer'
                onClick={() => setExpandedId(expandedId === claim.claim_id ? null : claim.claim_id)}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium text-sm'>{claim.claim_id}</p>
                    <p className='text-xs text-gray-500'>{truncateHash(claim.verification_hash)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </div>

                {expandedId === claim.claim_id && (
                  <div className='mt-3 pt-3 border-t space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Verification Hash:</span>
                      <span className='font-mono text-xs'>{truncateHash(claim.verification_hash)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Auditor Hash:</span>
                      <span className='font-mono text-xs'>{truncateHash(claim.auditor_hash)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Timestamp:</span>
                      <span>{timeAgo(claim.timestamp)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Transactions:</span>
                      <span>{claim.transaction_count}</span>
                    </div>
                    <Button variant='outline' size='sm' className='w-full mt-2'>
                      <ExternalLink className='h-3 w-3 mr-2' />
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
