'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface AuditResult {
  claim_id: string
  audit_findings: string[]
  final_decision: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW'
  confidence_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  notes: string
  auditor_name: string
  audit_date: string
}

export function AuditResultCard({ audit }: { audit: AuditResult }) {
  const [expanded, setExpanded] = useState(false)

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-green-50 border-green-200'
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-red-50 border-red-200'
    }
  }

  const getIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'REJECTED':
        return <AlertCircle className='h-5 w-5 text-red-600' />
      default:
        return <Clock className='h-5 w-5 text-yellow-600' />
    }
  }

  return (
    <Card className={getRiskColor(audit.risk_level)}>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <CardTitle className='flex items-center gap-2'>
              {getIcon(audit.final_decision)}
              Claim {audit.claim_id}
            </CardTitle>
            <CardDescription>Audited by {audit.auditor_name}</CardDescription>
          </div>
          <Badge className={getDecisionColor(audit.final_decision)}>{audit.final_decision}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600'>Confidence Score</p>
            <p className='text-2xl font-bold'>{Math.round(audit.confidence_score * 100)}%</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Risk Level</p>
            <p className='text-lg font-semibold'>{audit.risk_level}</p>
          </div>
        </div>

        {audit.audit_findings.length > 0 && (
          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              <p className='font-semibold mb-1'>Audit Findings:</p>
              <ul className='list-disc list-inside space-y-1'>
                {audit.audit_findings.map((finding, i) => (
                  <li key={i} className='text-sm'>
                    {finding}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {expanded && (
          <div className='bg-white/50 p-3 rounded border space-y-2 text-sm'>
            <div>
              <p className='text-gray-600'>Auditor Notes:</p>
              <p>{audit.notes}</p>
            </div>
            <div>
              <p className='text-gray-600'>Audit Date:</p>
              <p>{new Date(audit.audit_date).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <Button variant='outline' size='sm' onClick={() => setExpanded(!expanded)} className='w-full'>
          {expanded ? 'Hide Details' : 'View Full Audit'}
        </Button>
      </CardContent>
    </Card>
  )
}
