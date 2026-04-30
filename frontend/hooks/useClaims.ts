'use client'

import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'
import { apiClient } from '@/lib/api'
import { Claim, ClaimsListResponse } from '@/lib/types'
import { POLLING_INTERVALS } from '@/lib/constants'

export function useClaims(patientId?: string, autoFetch = true) {
  const { data, loading, error, execute } = useApi<ClaimsListResponse>(() => apiClient.getClaims(patientId))

  useEffect(() => {
    if (autoFetch) {
      execute()
    }
  }, [autoFetch, execute])

  return {
    claims: data?.claims || [],
    total: data?.total || 0,
    processed: data?.processed || 0,
    pending: data?.pending || 0,
    loading,
    error,
    refetch: execute,
  }
}

export function useClaimDetails(claimId: string) {
  const { data, loading, error, execute } = useApi(() => apiClient.getClaimDetails(claimId))

  useEffect(() => {
    if (claimId) {
      execute()
    }
  }, [claimId, execute])

  return {
    claim: data,
    loading,
    error,
    refetch: execute,
  }
}

export function useClaimStatus(claimId: string) {
  const { data, loading, error, execute } = useApi(() =>
    apiClient.getClaimStatus(claimId)
  )

  useEffect(() => {
    if (claimId) {
      execute()
    }
  }, [claimId, execute])

  return {
    status: data?.status,
    loading,
    error,
    refetch: execute,
  }
}

export function usePendingClaims() {
  const { data, loading, error, execute } = useApi<ClaimsListResponse>(() =>
    apiClient.getPendingClaims()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    claims: data?.claims || [],
    loading,
    error,
    refetch: execute,
  }
}

export function useSubmitClaim() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submit = useCallback(async (payload: any) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await apiClient.submitClaim(payload)
      if (response.success) {
        setSuccess(true)
        return response.data
      } else {
        setError(response.error || 'Failed to submit claim')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    submit,
    loading,
    error,
    success,
  }
}
