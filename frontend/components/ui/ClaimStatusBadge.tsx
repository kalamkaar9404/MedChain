import { ClaimStatus } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ClaimStatusBadgeProps {
  status: ClaimStatus
  size?: 'sm' | 'md' | 'lg'
}

export function ClaimStatusBadge({ status, size = 'md' }: ClaimStatusBadgeProps) {
  const config = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={cn('rounded-full font-medium border', sizeClasses[size], config.bg, config.text, config.border)}>
      {label}
    </span>
  )
}
