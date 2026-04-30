'use client'

import { useState, useCallback } from 'react'
import { ApiResponse } from '@/lib/types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
  }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiCall()
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null })
        options?.onSuccess?.(response.data)
      } else {
        const error = response.error || 'Unknown error'
        setState({ data: null, loading: false, error })
        options?.onError?.(error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({ data: null, loading: false, error: errorMessage })
      options?.onError?.(errorMessage)
    }
  }, [apiCall, options])

  return {
    ...state,
    execute,
  }
}
