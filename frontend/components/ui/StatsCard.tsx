import { cn, formatCurrency } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6 border border-gray-100', className)}>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-gray-600 text-sm font-medium'>{title}</p>
          <p className='text-2xl font-bold text-slate-900 mt-2'>
            {typeof value === 'number' && title.includes('Balance') ? formatCurrency(value) : value}
          </p>
          {trend && (
            <p className={cn('text-sm mt-2', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? '+' : '-'}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && <Icon className='text-gray-400 w-8 h-8' />}
      </div>
    </div>
  )
}
