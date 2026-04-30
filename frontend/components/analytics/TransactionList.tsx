'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getRiskColor, truncateHash } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface TransactionListProps {
  transactions: Array<{
    hash: string
    claimId: string
    status: string
    amount: number
    timestamp: string
    riskScore?: number
  }>
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Blockchain Transactions</CardTitle>
        <CardDescription>Latest transactions recorded on the blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {transactions.length === 0 ? (
            <p className='text-muted-foreground text-center py-8'>No transactions yet</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.hash} className='flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <code className='text-sm font-mono bg-slate-100 px-2 py-1 rounded'>{truncateHash(tx.hash)}</code>
                    <ExternalLink className='w-4 h-4 text-slate-400' />
                  </div>
                  <p className='text-sm text-muted-foreground'>Claim: {tx.claimId}</p>
                </div>
                <div className='text-right space-y-1'>
                  <p className='font-semibold'>{formatCurrency(tx.amount)}</p>
                  <Badge variant='outline'>{tx.status}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
