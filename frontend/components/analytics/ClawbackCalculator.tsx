'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface ClawbackCalculatorProps {
  clawbacks: Array<{
    id: string
    claimId: string
    originalAmount: number
    clawbackAmount: number
    reason: string
    status: string
    date: string
  }>
}

export function ClawbackCalculator({ clawbacks }: ClawbackCalculatorProps) {
  const totalClawbacks = clawbacks.reduce((sum, cb) => sum + cb.clawbackAmount, 0)
  const totalOriginal = clawbacks.reduce((sum, cb) => sum + cb.originalAmount, 0)
  const clawbackPercentage = totalOriginal > 0 ? ((totalClawbacks / totalOriginal) * 100).toFixed(2) : '0'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clawback Summary</CardTitle>
        <CardDescription>Overview of claim amounts being recovered</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='text-center p-4 bg-slate-50 rounded-lg'>
            <p className='text-sm text-muted-foreground mb-1'>Total Original</p>
            <p className='text-xl font-bold'>{formatCurrency(totalOriginal)}</p>
          </div>
          <div className='text-center p-4 bg-red-50 rounded-lg'>
            <p className='text-sm text-muted-foreground mb-1'>Total Clawback</p>
            <p className='text-xl font-bold text-red-600'>{formatCurrency(totalClawbacks)}</p>
          </div>
          <div className='text-center p-4 bg-slate-50 rounded-lg'>
            <p className='text-sm text-muted-foreground mb-1'>Clawback %</p>
            <p className='text-xl font-bold'>{clawbackPercentage}%</p>
          </div>
        </div>

        <div className='space-y-3'>
          {clawbacks.length === 0 ? (
            <p className='text-muted-foreground text-center py-8'>No clawbacks recorded</p>
          ) : (
            clawbacks.map((cb) => (
              <div key={cb.id} className='p-3 border rounded-lg'>
                <div className='flex items-start justify-between mb-2'>
                  <div>
                    <p className='font-semibold text-sm'>Claim {cb.claimId}</p>
                    <p className='text-xs text-muted-foreground'>{cb.reason}</p>
                  </div>
                  <Badge variant={cb.status === 'COMPLETED' ? 'default' : 'secondary'}>{cb.status}</Badge>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Original: {formatCurrency(cb.originalAmount)}</span>
                  <span className='text-red-600 font-semibold'>Clawback: {formatCurrency(cb.clawbackAmount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
