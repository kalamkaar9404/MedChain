'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Zap } from 'lucide-react'

export function FeatureShowcase() {
  const features = [
    {
      title: 'Claim Submission',
      description: 'Submit insurance claims with document verification',
      status: 'ready',
      icon: CheckCircle,
    },
    {
      title: 'Real-time Processing',
      description: 'Claims processed with AI-powered risk detection',
      status: 'ready',
      icon: Zap,
    },
    {
      title: 'Blockchain Verification',
      description: 'Immutable transaction records on distributed ledger',
      status: 'ready',
      icon: CheckCircle,
    },
    {
      title: 'Fraud Detection',
      description: 'ML-based anomaly detection and flagging system',
      status: 'ready',
      icon: AlertCircle,
    },
    {
      title: 'Audit Trail',
      description: 'Complete audit history with digital signatures',
      status: 'ready',
      icon: CheckCircle,
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time metrics and claim processing analytics',
      status: 'ready',
      icon: Zap,
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {features.map((feature, i) => {
        const Icon = feature.icon
        return (
          <Card key={i} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <Icon className='h-5 w-5 text-blue-600' />
                <Badge variant={feature.status === 'ready' ? 'default' : 'secondary'}>
                  {feature.status === 'ready' ? 'Ready' : 'Coming Soon'}
                </Badge>
              </div>
              <CardTitle className='text-lg'>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>{feature.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
