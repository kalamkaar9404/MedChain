'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoadingStateProps {
  isLoading: boolean
  error?: string | null
  children: React.ReactNode
  onRetry?: () => void
}

export function LoadingState({ isLoading, error, children, onRetry }: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <Loader2 className='w-8 h-8 animate-spin text-slate-400 mb-3' />
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg'>
        <p className='text-red-700 font-semibold mb-3'>Error loading data</p>
        <p className='text-red-600 text-sm mb-4'>{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant='outline' size='sm'>
            <ArrowRight className='w-4 h-4 mr-2' />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return children
}
