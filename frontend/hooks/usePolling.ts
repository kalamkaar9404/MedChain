'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options?: {
    interval?: number
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const interval = options?.interval || 5000
  const enabled = options?.enabled !== false

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchFn()
      setData(result)
      setError(null)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, options])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetch()

    // Set up polling
    intervalRef.current = setInterval(fetch, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetch, interval, enabled])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!intervalRef.current) {
      fetch()
      intervalRef.current = setInterval(fetch, interval)
    }
  }, [fetch, interval])

  return {
    data,
    loading,
    error,
    refetch: fetch,
    stop,
    start,
  }
}
