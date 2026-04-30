'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface AnomalyCardProps {
  anomalies: Array<{
    id: string
    claimId: string
    type: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    description: string
    timestamp: string
  }>
}

const SEVERITY_COLORS = {
  LOW: 'bg-yellow-50 border-yellow-200',
  MEDIUM: 'bg-orange-50 border-orange-200',
  HIGH: 'bg-red-50 border-red-200',
}

const SEVERITY_BADGE: Record<'LOW' | 'MEDIUM' | 'HIGH', 'outline' | 'secondary' | 'destructive'> = {
  LOW: 'outline',
  MEDIUM: 'secondary',
  HIGH: 'destructive',
}

export function AnomalyCard({ anomalies }: AnomalyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Anomalies</CardTitle>
        <CardDescription>AI-detected suspicious patterns in claims</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {anomalies.length === 0 ? (
            <div className='flex items-center justify-center py-8 text-green-600'>
              <CheckCircle className='w-5 h-5 mr-2' />
              <p>No anomalies detected</p>
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div key={anomaly.id} className={`p-4 border rounded-lg ${SEVERITY_COLORS[anomaly.severity]}`}>
                <div className='flex items-start gap-3'>
                  <AlertTriangle className='w-5 h-5 mt-0.5 text-orange-600 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-semibold text-sm'>{anomaly.type}</p>
                      <Badge variant={SEVERITY_BADGE[anomaly.severity]}>{anomaly.severity}</Badge>
                    </div>
                    <p className='text-sm text-slate-700 mb-1'>{anomaly.description}</p>
                    <p className='text-xs text-slate-600'>Claim ID: {anomaly.claimId}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
