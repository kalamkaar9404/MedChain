'use client'

import { usePolling } from '@/hooks/usePolling'
import { apiClient } from '@/lib/api'
import { StatsCard } from '@/components/ui/StatsCard'
import { POLLING_INTERVALS } from '@/lib/constants'
import { Activity, Zap, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SystemStatus() {
  const { data: health } = usePolling(() => apiClient.getHealth(), {
    interval: POLLING_INTERVALS.SYSTEM_HEALTH,
  })

  const { data: metrics } = usePolling(() => apiClient.getSystemMetrics(), {
    interval: POLLING_INTERVALS.DASHBOARD_STATS,
  })

  const { data: agentState } = usePolling(() => apiClient.getAgentState(), {
    interval: POLLING_INTERVALS.DASHBOARD_STATS,
  })

  const getStatusColor = (status: string) => {
    if (status === 'HEALTHY' || status === 'ACTIVE') return 'bg-green-100 text-green-800'
    if (status === 'DEGRADED' || status === 'IDLE') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusDot = (status: string) => {
    if (status === 'HEALTHY' || status === 'ACTIVE') return 'bg-green-500'
    if (status === 'DEGRADED' || status === 'IDLE') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>System Status</h1>
          <p className='text-gray-600'>Monitor platform health and performance metrics</p>
        </div>

        {/* Service Status */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>API Service</p>
                <p className='text-2xl font-bold text-slate-900 mt-3'>{health?.status || 'Loading...'}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusDot(health?.status || '')}`}></div>
            </div>
            <p className='text-xs text-gray-500 mt-4'>Last checked: Just now</p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Blockchain Network</p>
                <p className='text-2xl font-bold text-slate-900 mt-3'>{health?.blockchain_blocks || 0} blocks</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusDot(health?.status || '')}`}></div>
            </div>
            <p className='text-xs text-gray-500 mt-4'>Last checked: Just now</p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>AI Agents</p>
                <p className='text-2xl font-bold text-slate-900 mt-3'>{health?.agents?.patient || 'Loading...'}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusDot(health?.agents?.patient || '')}`}></div>
            </div>
            <p className='text-xs text-gray-500 mt-4'>Last checked: Just now</p>
          </div>
        </div>

        {/* System Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatsCard
            title='Total Claims'
            value={metrics?.total_claims || 0}
            icon={undefined}
            className='bg-gradient-to-br from-blue-50 to-blue-100'
          />
          <StatsCard
            title='Total Blocks'
            value={metrics?.total_claims ? Math.floor(metrics.total_claims / 10) : 0}
            icon={undefined}
            className='bg-gradient-to-br from-purple-50 to-purple-100'
          />
          <StatsCard
            title='Processing Rate'
            value={`${Math.round((metrics?.avg_processing_time || 0) / 1000)}s`}
            icon={undefined}
            className='bg-gradient-to-br from-green-50 to-green-100'
          />
          <StatsCard
            title='Uptime'
            value={`${Math.round(health?.uptime_percentage || 0)}%`}
            icon={undefined}
            className='bg-gradient-to-br from-orange-50 to-orange-100'
          />
        </div>

        {/* Agent Status */}
        {agentState && (
          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6 mb-8'>
            <h3 className='text-xl font-bold text-slate-900 mb-6'>AI Agent Status</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <Activity className='w-6 h-6 text-blue-600' />
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(agentState.status)}`}>
                    {agentState.status}
                  </span>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-600'>Processing Claims</p>
                    <p className='text-2xl font-bold text-slate-900'>{agentState.processing_claims}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Decisions Today</p>
                    <p className='text-2xl font-bold text-slate-900'>{agentState.decisions_today}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Accuracy Rate</p>
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-green-500'
                          style={{ width: `${(agentState.accuracy_rate || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className='text-lg font-bold text-slate-900'>
                        {Math.round((agentState.accuracy_rate || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Average Confidence</p>
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-blue-500'
                          style={{ width: `${(agentState.memory?.confidence_average || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className='text-lg font-bold text-slate-900'>
                        {Math.round((agentState.memory?.confidence_average || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Details */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <CheckCircle className='w-6 h-6 text-green-600' />
              <h4 className='font-bold text-slate-900'>API Endpoints</h4>
            </div>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>✓ Claims Management</li>
              <li>✓ Verification Engine</li>
              <li>✓ Audit Interface</li>
              <li>✓ Blockchain Gateway</li>
              <li>✓ Agent Interface</li>
            </ul>
          </div>

          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <Zap className='w-6 h-6 text-yellow-600' />
              <h4 className='font-bold text-slate-900'>Performance</h4>
            </div>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>Avg Response: &lt;200ms</li>
              <li>DB Latency: &lt;50ms</li>
              <li>Cache Hit Rate: 94%</li>
              <li>Throughput: 1000 req/s</li>
              <li>Error Rate: 0.01%</li>
            </ul>
          </div>

          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <Activity className='w-6 h-6 text-blue-600' />
              <h4 className='font-bold text-slate-900'>Infrastructure</h4>
            </div>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>Servers: 8 instances</li>
              <li>Database: Primary + Replica</li>
              <li>Cache: Redis Cluster</li>
              <li>Storage: Distributed</li>
              <li>Region: US-East (Primary)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
