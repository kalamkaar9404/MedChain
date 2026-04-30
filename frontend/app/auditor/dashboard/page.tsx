'use client'

import { useState } from 'react'
import { useAuditQueue, useAnomalies } from '@/hooks/useBlockchain'
import { usePolling } from '@/hooks/usePolling'
import { apiClient } from '@/lib/api'
import { StatsCard } from '@/components/ui/StatsCard'
import { ClaimStatusBadge } from '@/components/ui/ClaimStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { POLLING_INTERVALS } from '@/lib/constants'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Loader, AlertTriangle } from 'lucide-react'
import { Anomaly, AuditStatus } from '@/lib/types'

export default function AuditorDashboard() {
  const { claims } = useAuditQueue()
  const { anomalies } = useAnomalies()
  const [selectedClaim, setSelectedClaim] = useState(claims[0])
  const [clawbackAmount, setClawbackAmount] = useState('')
  const [clawbackReason, setClawbackReason] = useState('')
  const [severity, setSeverity] = useState('HIGH')
  const [actionLoading, setActionLoading] = useState(false)

  const { data: stats } = usePolling(() => apiClient.getSystemMetrics(), {
    interval: POLLING_INTERVALS.DASHBOARD_STATS,
  })

  const handleClawback = async () => {
    if (!selectedClaim || !clawbackAmount || !clawbackReason) return
    setActionLoading(true)
    await apiClient.clawback(selectedClaim.id, {
      claim_id: selectedClaim.id,
      amount: parseFloat(clawbackAmount),
      reason: clawbackReason,
      severity: severity as any,
    })
    setActionLoading(false)
    setClawbackAmount('')
    setClawbackReason('')
  }

  // Prepare cost pattern data
  const costPatternData = [
    { month: 'Jan', avg: 5200, flagged: 850 },
    { month: 'Feb', avg: 5800, flagged: 950 },
    { month: 'Mar', avg: 6100, flagged: 1200 },
    { month: 'Apr', avg: 5900, flagged: 1400 },
    { month: 'May', avg: 6300, flagged: 1100 },
    { month: 'Jun', avg: 6500, flagged: 1600 },
  ]

  const anomalyStats = {
    critical: anomalies?.filter((a) => a.severity === 'CRITICAL').length || 0,
    high: anomalies?.filter((a) => a.severity === 'HIGH').length || 0,
    medium: anomalies?.filter((a) => a.severity === 'MEDIUM').length || 0,
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Auditor Dashboard</h1>
          <p className='text-gray-600'>Review flagged claims and manage audit processes</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatsCard
            title='Audit Queue'
            value={claims.length}
            icon={undefined}
            className='bg-gradient-to-br from-red-50 to-red-100'
          />
          <StatsCard
            title='Critical Anomalies'
            value={anomalyStats.critical}
            icon={undefined}
            className='bg-gradient-to-br from-orange-50 to-orange-100'
          />
          <StatsCard
            title='High Risk'
            value={anomalyStats.high}
            icon={undefined}
            className='bg-gradient-to-br from-yellow-50 to-yellow-100'
          />
          <StatsCard
            title='Pending Review'
            value={anomalies?.filter((a) => a.investigation_status === 'PENDING').length || 0}
            icon={undefined}
            className='bg-gradient-to-br from-blue-50 to-blue-100'
          />
        </div>

        {/* Cost Pattern Analysis */}
        <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100 mb-8'>
          <h3 className='text-lg font-bold text-slate-900 mb-4'>Cost Pattern Analysis</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={costPatternData}>
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='avg' fill='#3b82f6' name='Average Cost' />
              <Bar dataKey='flagged' fill='#ef4444' name='Flagged Cases' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Main Audit Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Audit Queue */}
          <div className='lg:col-span-1 bg-white rounded-lg shadow-lg border border-gray-100'>
            <div className='p-6 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-slate-900'>Audit Queue</h3>
            </div>
            <div className='divide-y divide-gray-100 max-h-96 overflow-y-auto'>
              {claims.length === 0 ? (
                <div className='p-6 text-center text-gray-500'>No claims to audit</div>
              ) : (
                claims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedClaim?.id === claim.id ? 'bg-red-50 border-l-4 border-l-red-600' : ''
                    }`}
                  >
                    <div className='flex items-start gap-2'>
                      <AlertTriangle className='w-4 h-4 text-red-600 flex-shrink-0 mt-0.5' />
                      <div>
                        <p className='font-mono text-sm text-blue-600 font-medium'>{claim.id}</p>
                        <p className='text-sm text-gray-600 mt-1'>{formatCurrency(claim.amount)}</p>
                        <p className='text-xs text-gray-500 mt-1'>{formatDate(claim.submission_date)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Deep Audit Interface */}
          <div className='lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100'>
            {selectedClaim ? (
              <div className='p-6'>
                <div className='flex items-start justify-between mb-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-slate-900'>{selectedClaim.id}</h3>
                    <p className='text-gray-600 text-sm mt-1'>Status: Under Audit</p>
                  </div>
                  <div className='bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold text-sm'>
                    Risk: {(selectedClaim.risk_score * 100).toFixed(0)}%
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-gray-600 text-sm'>Claim Amount</p>
                    <p className='text-2xl font-bold text-slate-900 mt-1'>{formatCurrency(selectedClaim.amount)}</p>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-gray-600 text-sm'>Patient ID</p>
                    <p className='text-lg font-mono text-slate-900 mt-1'>{selectedClaim.patient_id}</p>
                  </div>
                </div>

                {/* Anomalies for this claim */}
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <h4 className='font-semibold text-slate-900 mb-3'>Detected Anomalies</h4>
                  <div className='space-y-2'>
                    {anomalies
                      ?.filter((a) => a.claim_id === selectedClaim.id)
                      .slice(0, 3)
                      .map((anomaly) => (
                        <div
                          key={anomaly.id}
                          className={`p-3 rounded border-l-4 ${
                            anomaly.severity === 'CRITICAL'
                              ? 'bg-red-50 border-l-red-600'
                              : anomaly.severity === 'HIGH'
                                ? 'bg-orange-50 border-l-orange-600'
                                : 'bg-yellow-50 border-l-yellow-600'
                          }`}
                        >
                          <div className='flex items-start justify-between'>
                            <div>
                              <p className='font-medium text-slate-900 text-sm'>{anomaly.type}</p>
                              <p className='text-xs text-gray-600 mt-1'>{anomaly.description}</p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                                anomaly.severity === 'CRITICAL'
                                  ? 'bg-red-200 text-red-800'
                                  : anomaly.severity === 'HIGH'
                                    ? 'bg-orange-200 text-orange-800'
                                    : 'bg-yellow-200 text-yellow-800'
                              }`}
                            >
                              {anomaly.severity}
                            </span>
                          </div>
                        </div>
                      )) || <p className='text-gray-600 text-sm'>No anomalies detected</p>}
                  </div>
                </div>

                {/* Clawback Calculator */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-slate-900'>Clawback Calculator</h4>

                  <div>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>Severity Level</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                      <option value='LOW'>Low - 10% of claim</option>
                      <option value='MEDIUM'>Medium - 25% of claim</option>
                      <option value='HIGH'>High - 50% of claim</option>
                      <option value='CRITICAL'>Critical - 100% of claim</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>Clawback Amount</label>
                    <div className='flex gap-2'>
                      <span className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-sm'>
                        $
                      </span>
                      <input
                        type='number'
                        step='0.01'
                        value={clawbackAmount}
                        onChange={(e) => setClawbackAmount(e.target.value)}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                        placeholder='0.00'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-900 mb-2'>Reason</label>
                    <textarea
                      value={clawbackReason}
                      onChange={(e) => setClawbackReason(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none'
                      placeholder='Explain the reason for clawback...'
                    />
                  </div>

                  <button
                    onClick={handleClawback}
                    disabled={actionLoading || !clawbackAmount || !clawbackReason}
                    className='w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                  >
                    {actionLoading && <Loader className='w-5 h-5 animate-spin' />}
                    Execute Clawback
                  </button>
                </div>
              </div>
            ) : (
              <div className='p-6 text-center text-gray-500'>Select a claim to audit</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
