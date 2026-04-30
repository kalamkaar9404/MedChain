import { normalizeValue } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function RiskGauge({ score, size = 'md' }: RiskGaugeProps) {
  const normalized = normalizeValue(score, 0, 1)
  const percentage = normalized * 100

  // Color based on risk level
  const getColor = (val: number) => {
    if (val < 0.33) return 'from-green-500 to-green-400'
    if (val < 0.66) return 'from-yellow-500 to-yellow-400'
    return 'from-red-500 to-red-400'
  }

  const sizeClasses = {
    sm: 'w-20 h-10',
    md: 'w-32 h-16',
    lg: 'w-48 h-24',
  }

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  return (
    <div className={sizeClasses[size]}>
      <svg viewBox='0 0 100 50' className='w-full h-full'>
        {/* Background Arc */}
        <path
          d='M 10 50 A 40 40 0 0 1 90 50'
          fill='none'
          stroke='#e5e7eb'
          strokeWidth='8'
          strokeLinecap='round'
        />

        {/* Progress Arc */}
        <path
          d='M 10 50 A 40 40 0 0 1 90 50'
          fill='none'
          stroke={`url(#gradient-${score})`}
          strokeWidth='8'
          strokeLinecap='round'
          strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`gradient-${score}`} x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor={getColor(normalized).split(' ')[1]} />
            <stop offset='100%' stopColor={getColor(normalized).split(' ')[3]} />
          </linearGradient>
        </defs>

        {/* Center Text */}
        <text x='50' y='28' textAnchor='middle' className={textSize[size]} fill='#1e293b' fontWeight='bold'>
          {(normalized * 100).toFixed(0)}%
        </text>
        <text x='50' y='42' textAnchor='middle' className='text-xs' fill='#64748b'>
          Risk
        </text>
      </svg>
    </div>
  )
}
