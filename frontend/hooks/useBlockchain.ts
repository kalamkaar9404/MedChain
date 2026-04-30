'use client'

import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'
import { apiClient } from '@/lib/api'
import { BlockchainState, Transaction, Anomaly, AgentState } from '@/lib/types'

export function useBlockchain() {
  const { data, loading, error, execute } = useApi<BlockchainState>(() =>
    apiClient.getBlockchainState()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    blockchain: data,
    totalBlocks: data?.total_blocks || 0,
    totalTransactions: data?.total_transactions || 0,
    escrowBalance: data?.escrow_balance || 0,
    loading,
    error,
    refetch: execute,
  }
}

export function useTransactions() {
  const { data, loading, error, execute } = useApi<Transaction[]>(() =>
    apiClient.getTransactions()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    transactions: data || [],
    loading,
    error,
    refetch: execute,
  }
}

export function useAnomalies() {
  const { data, loading, error, execute } = useApi<Anomaly[]>(() =>
    apiClient.getAnomalies()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    anomalies: data || [],
    loading,
    error,
    refetch: execute,
  }
}

export function useAuditQueue() {
  const { data, loading, error, execute } = useApi<any[]>(() =>
    apiClient.getAuditQueue()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    claims: data || [],
    loading,
    error,
    refetch: execute,
  }
}

export function useAgentState() {
  const { data, loading, error, execute } = useApi<AgentState>(() =>
    apiClient.getAgentState()
  )

  useEffect(() => {
    execute()
  }, [execute])

  return {
    agent: data,
    loading,
    error,
    refetch: execute,
  }
}
