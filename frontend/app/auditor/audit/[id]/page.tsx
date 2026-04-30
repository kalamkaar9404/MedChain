import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClaimStatusBadge } from '@/components/ui/ClaimStatusBadge'
import { RiskGauge } from '@/components/ui/RiskGauge'
import { AnomalyCard } from '@/components/analytics/AnomalyCard'
import { formatCurrency, formatDate } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/constants'

interface AuditPageProps {
  params: { id: string }
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { id } = await Promise.resolve(params)

  let claim = null
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
      cache: 'no-store',
    })
    if (response.ok) {
      claim = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch claim:', error)
  }

  if (!claim) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold'>Claim not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Audit Review</h1>
          <p className='text-muted-foreground'>Claim ID: {claim.id}</p>
        </div>

        {/* Overview */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardContent className='pt-6'>
              <p className='text-sm text-muted-foreground'>Claim Amount</p>
              <p className='text-2xl font-bold text-primary'>{formatCurrency(claim.amount)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <p className='text-sm text-muted-foreground'>Status</p>
              <ClaimStatusBadge status={claim.status} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <p className='text-sm text-muted-foreground'>Risk Score</p>
              <p className='text-2xl font-bold text-orange-600'>{claim.risk_score?.toFixed(1) || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <p className='text-sm text-muted-foreground'>Submitted</p>
              <p className='text-sm font-medium'>{formatDate(claim.submission_date)}</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Risk Analysis */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-center'>
                  <RiskGauge score={claim.risk_score || 50} />
                </div>
                <div>
                  <p className='text-sm font-medium mb-2'>Risk Factors</p>
                  <ul className='text-sm space-y-1 text-muted-foreground'>
                    <li>• Amount exceeds average for service type</li>
                    <li>• Multiple claims in short timeframe</li>
                    <li>• Document verification pending</li>
                    <li>• Provider verification complete</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Anomalies Detected */}
            <AnomalyCard
              anomalies={[
                {
                  id: '1',
                  claimId: params.id,
                  type: 'Unusual Billing',
                  severity: 'MEDIUM',
                  description: 'Billing pattern differs from historical data',
                  timestamp: new Date().toISOString()
                },
                {
                  id: '2',
                  claimId: params.id,
                  type: 'Provider Mismatch',
                  severity: 'LOW',
                  description: 'Provider information requires verification',
                  timestamp: new Date().toISOString()
                },
                {
                  id: '3',
                  claimId: params.id,
                  type: 'Document Gap',
                  severity: 'HIGH',
                  description: 'Missing supporting documentation',
                  timestamp: new Date().toISOString()
                }
              ]}
            />
          </div>

          {/* Audit Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Audit Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 text-sm'>
                <div className='border-l-2 border-blue-500 pl-4'>
                  <p className='font-medium'>Submitted</p>
                  <p className='text-xs text-muted-foreground'>{formatDate(claim.submission_date)}</p>
                </div>
                <div className='border-l-2 border-yellow-500 pl-4'>
                  <p className='font-medium'>Initial Review</p>
                  <p className='text-xs text-muted-foreground'>In Progress</p>
                </div>
                <div className='border-l-2 border-gray-300 pl-4'>
                  <p className='font-medium'>Document Verification</p>
                  <p className='text-xs text-muted-foreground'>Pending</p>
                </div>
                <div className='border-l-2 border-gray-300 pl-4'>
                  <p className='font-medium'>Final Decision</p>
                  <p className='text-xs text-muted-foreground'>Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Audit Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm font-medium text-green-900'>Approve</p>
                <p className='text-xs text-green-700 mt-1'>Low risk - supports approval</p>
              </div>
              <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <p className='text-sm font-medium text-yellow-900'>Review Further</p>
                <p className='text-xs text-yellow-700 mt-1'>Request additional documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
