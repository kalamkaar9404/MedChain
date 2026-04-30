import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClaimStatusBadge } from '@/components/ui/ClaimStatusBadge'
import { VerificationFlow } from '@/components/verification/VerificationFlow'
import { DocumentVerification } from '@/components/verification/DocumentVerification'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/constants'

interface ClaimDetailsPageProps {
  params: { id: string }
}

export default async function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const { id } = await Promise.resolve(params)

  // Fetch claim details
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
    notFound()
  }

  const verificationSteps = [
    {
      id: 'submission',
      title: 'Claim Submitted',
      status: 'completed' as const,
      description: `Submitted on ${formatDate(claim.submission_date)}`,
    },
    {
      id: 'verification',
      title: 'Document Verification',
      status: claim.status === 'SUBMITTED' ? 'current' : 'completed',
      description: 'Verifying documents and eligibility',
    },
    {
      id: 'review',
      title: 'Insurance Review',
      status: claim.status === 'REVIEWED' ? 'current' : claim.status === 'APPROVED' ? 'completed' : 'pending',
      description: 'Risk assessment and approval',
    },
    {
      id: 'settlement',
      title: 'Settlement',
      status: claim.status === 'SETTLED' ? 'completed' : 'pending',
      description: 'Blockchain finalization',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Claim Details</h1>
          <p className='text-muted-foreground'>Claim ID: {claim.id}</p>
        </div>

        {/* Summary Card */}
        <Card className='mb-6'>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div>
                <CardTitle>Claim Summary</CardTitle>
                <CardDescription>{claim.patient_name}</CardDescription>
              </div>
              <ClaimStatusBadge status={claim.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Claim Amount</p>
                <p className='text-xl font-bold text-primary'>{formatCurrency(claim.amount)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Submitted</p>
                <p className='text-lg font-semibold'>{formatDate(claim.submission_date)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Risk Score</p>
                <p className='text-lg font-semibold text-orange-600'>{claim.risk_score?.toFixed(1) || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Provider</p>
                <p className='text-lg font-semibold'>{claim.provider_name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Flow */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <VerificationFlow steps={verificationSteps} />
          </CardContent>
        </Card>

        {/* Document Verification */}
        {claim.documents && claim.documents.length > 0 && (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {claim.documents.map((doc: any, idx: number) => (
                <DocumentVerification
                  key={idx}
                  documentId={doc.id || `DOC-${idx + 1}`}
                  type={doc.type || 'Document'}
                  verificationStatus={doc.verification_status || 'pending'}
                  uploadDate={doc.upload_date || new Date().toISOString()}
                  verifiedBy={doc.verified_by}
                  flags={doc.flags}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Diagnosis Code</p>
                <p className='font-medium'>{claim.diagnosis_code || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Service Type</p>
                <p className='font-medium'>{claim.service_type || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Policy Number</p>
                <p className='font-medium'>{claim.policy_number || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Insurance Provider</p>
                <p className='font-medium'>{claim.insurance_provider || 'N/A'}</p>
              </div>
            </div>
            {claim.notes && (
              <div className='mt-4'>
                <p className='text-sm text-muted-foreground'>Notes</p>
                <p className='text-sm mt-1'>{claim.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex gap-3'>
          <Button variant='outline'>Download Details</Button>
          <Button>Contact Support</Button>
        </div>
      </div>
    </div>
  )
}
