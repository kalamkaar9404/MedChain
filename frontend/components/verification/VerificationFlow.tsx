'use client'

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface VerificationFlowProps {
  steps: Array<{
    id: string
    title: string
    status: 'completed' | 'current' | 'pending'
    description?: string
  }>
}

export function VerificationFlow({ steps }: VerificationFlowProps) {
  return (
    <div className='space-y-4'>
      {steps.map((step, idx) => (
        <div key={step.id} className='flex gap-4'>
          <div className='flex flex-col items-center'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-green-100'
                  : step.status === 'current'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle2 className='w-5 h-5 text-green-600' />
              ) : step.status === 'current' ? (
                <Clock className='w-5 h-5 text-blue-600' />
              ) : (
                <AlertCircle className='w-5 h-5 text-gray-400' />
              )}
            </div>
            {idx < steps.length - 1 && <div className='w-0.5 h-8 bg-border my-2' />}
          </div>
          <div className='flex-1 py-1'>
            <p className='font-medium text-sm'>{step.title}</p>
            {step.description && <p className='text-xs text-muted-foreground mt-1'>{step.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
