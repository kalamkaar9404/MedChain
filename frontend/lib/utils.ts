import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ClaimStatus } from './types'
import { RISK_SCORE_THRESHOLDS, RISK_SCORE_COLORS, STATUS_LABELS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency Formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Date Formatting
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy')
  } catch {
    return 'Invalid Date'
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy HH:mm:ss')
  } catch {
    return 'Invalid Date'
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'HH:mm:ss')
  } catch {
    return 'Invalid Time'
  }
}

// Risk Score Helpers
export function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score <= RISK_SCORE_THRESHOLDS.LOW) return 'LOW'
  if (score <= RISK_SCORE_THRESHOLDS.MEDIUM) return 'MEDIUM'
  return 'HIGH'
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score)
  return RISK_SCORE_COLORS[level]
}

export function getRiskBackgroundColor(score: number): string {
  const level = getRiskLevel(score)
  if (level === 'LOW') return 'bg-green-50'
  if (level === 'MEDIUM') return 'bg-yellow-50'
  return 'bg-red-50'
}

// Status Helpers
export function getStatusLabel(status: ClaimStatus): string {
  return STATUS_LABELS[status] || status
}

// Claim Filtering and Sorting
export interface ClaimForFiltering {
  id: string
  amount: number
  status: ClaimStatus
  submission_date: string
  risk_score: number
}

export function filterClaimsByStatus(
  claims: ClaimForFiltering[],
  status: ClaimStatus | 'ALL'
): ClaimForFiltering[] {
  if (status === 'ALL') return claims
  return claims.filter((claim) => claim.status === status)
}

export function sortClaimsByDate(claims: ClaimForFiltering[], direction: 'asc' | 'desc' = 'desc'): ClaimForFiltering[] {
  return [...claims].sort((a, b) => {
    const dateA = new Date(a.submission_date).getTime()
    const dateB = new Date(b.submission_date).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export function sortClaimsByAmount(claims: ClaimForFiltering[], direction: 'asc' | 'desc' = 'desc'): ClaimForFiltering[] {
  return [...claims].sort((a, b) => (direction === 'asc' ? a.amount - b.amount : b.amount - a.amount))
}

export function sortClaimsByRisk(claims: ClaimForFiltering[], direction: 'desc' | 'asc' = 'desc'): ClaimForFiltering[] {
  return [...claims].sort((a, b) =>
    direction === 'desc' ? b.risk_score - a.risk_score : a.risk_score - b.risk_score
  )
}

// Search Helpers
export function searchClaims(claims: ClaimForFiltering[], query: string): ClaimForFiltering[] {
  if (!query) return claims
  const lowerQuery = query.toLowerCase()
  return claims.filter((claim) => claim.id.toLowerCase().includes(lowerQuery))
}

// Array Utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])
      if (!result[groupKey]) result[groupKey] = []
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}

// Percentage calculation
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

// Range calculation (for risk gauges)
export function normalizeValue(value: number, min: number = 0, max: number = 1): number {
  return Math.max(min, Math.min(max, value))
}

// Text truncation
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Hash truncation (for blockchain)
export function truncateHash(hash: string, start: number = 6, end: number = 4): string {
  if (hash.length <= start + end) return hash
  return hash.slice(0, start) + '...' + hash.slice(-end)
}

// Time ago formatter
export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}
