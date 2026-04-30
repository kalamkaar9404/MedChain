'use client'

import { useState } from 'react'
import { usePendingClaims } from '@/hooks/useClaims'
import { usePolling } from '@/hooks/usePolling'
import { apiClient } from '@/lib/api'
import { StatsCard } from '@/components/ui/StatsCard'
import { ClaimStatusBadge } from '@/components/ui/ClaimStatusBadge'
import { RiskGauge } from '@/components/ui/RiskGauge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { POLLING_INTERVALS } from '@/lib/constants'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { Loader, CheckCircle, XCircle } from 'lucide-react'

const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function InsurerDashboard() {
  const { claims, loading } = usePendingClaims()
  const [selectedClaim, setSelectedClaim] = useState(claims[0])
  const [actionLoading, setActionLoading] = useState(false)

  const { data: stats } = usePolling(() => apiClient.getInsurerStats(), {
    interval: POLLING_INTERVALS.DASHBOARD_STATS,
  })

  const handleApprove = async () => {
    if (!selectedClaim) return
    setActionLoading(true)
    await apiClient.approveClaim(selectedClaim.id)
    setActionLoading(false)
  }

  const handleReject = async () => {
    if (!selectedClaim) return
    setActionLoading(true)
    await apiClient.rejectClaim(selectedClaim.id, 'Rejected by insurer')
    setActionLoading(false)
  }

  // Prepare chart data
  const statusData = [
    { name: 'Approved', value: stats?.data?.approved_claims || 0, fill: '#10b981' },
    { name: 'Rejected', value: stats?.data?.rejected_claims || 0, fill: '#ef4444' },
    { name: 'Pending', value: stats?.data?.pending_claims || 0, fill: '#f59e0b' },
  ].filter((d) => d.value > 0)

  const riskDistribution = [
    { name: 'Low Risk', value: Math.floor((claims.filter((c) => c.risk_score < 0.33).length / claims.length) * 100) || 0 },
    { name: 'Medium Risk', value: Math.floor((claims.filter((c) => c.risk_score >= 0.33 && c.risk_score < 0.66).length / claims.length) * 100) || 0 },
    { name: 'High Risk', value: Math.floor((claims.filter((c) => c.risk_score >= 0.66).length / claims.length) * 100) || 0 },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Insurer Dashboard</h1>
          <p className='text-gray-600'>Review and process pending claims</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
          <StatsCard
            title='Total Claims'
            value={stats?.data?.total_claims || 0}
            icon={undefined}
            className='bg-gradient-to-br from-blue-50 to-blue-100'
          />
          <StatsCard
            title='Approval Rate'
            value={`${Math.round(((stats?.data?.approved_claims || 0) / (stats?.data?.total_claims || 1)) * 100)}%`}
            icon={undefined}
            className='bg-gradient-to-br from-green-50 to-green-100'
          />
          <StatsCard
            title='Avg Processing'
            value={`${Math.round((stats?.data?.avg_processing_time || 0) / 1000)}s`}
            icon={undefined}
            className='bg-gradient-to-br from-purple-50 to-purple-100'
          />
          <StatsCard
            title='Fraud Detection'
            value={`${Math.round(stats?.data?.fraud_detection_rate || 0)}%`}
            icon={undefined}
            className='bg-gradient-to-br from-orange-50 to-orange-100'
          />
          <StatsCard
            title='Escrow Balance'
            value={formatCurrency(stats?.data?.escrow_balance || 0)}
            icon={undefined}
            className='bg-gradient-to-br from-emerald-50 to-emerald-100'
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          {/* Charts */}
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h3 className='text-lg font-bold text-slate-900 mb-4'>Claims Status</h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie data={statusData} cx='50%' cy='50%' innerRadius={60} outerRadius={90} paddingAngle={2} dataKey='value'>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h3 className='text-lg font-bold text-slate-900 mb-4'>Risk Distribution</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={riskDistribution}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h3 className='text-lg font-bold text-slate-900 mb-4'>Pending Claims</h3>
            <div className='space-y-2'>
              <p className='text-4xl font-bold text-blue-600'>{claims.length}</p>
              <p className='text-sm text-gray-600'>Awaiting review</p>
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <p className='text-sm font-medium text-slate-900 mb-2'>High Risk: {claims.filter((c) => c.risk_score > 0.66).length}</p>
                <div className='w-full h-2 bg-red-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-red-600'
                    style={{ width: `${Math.min(100, (claims.filter((c) => c.risk_score > 0.66).length / claims.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Claims Queue and Claim Review */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Pending Claims List */}
          <div className='lg:col-span-1 bg-white rounded-lg shadow-lg border border-gray-100'>
            <div className='p-6 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-slate-900'>Pending Queue</h3>
            </div>
            <div className='divide-y divide-gray-100 max-h-96 overflow-y-auto'>
              {loading ? (
                <div className='p-6 text-center'>
                  <Loader className='w-6 h-6 animate-spin text-blue-600 mx-auto' />
                </div>
              ) : claims.length === 0 ? (
                <div className='p-6 text-center text-gray-500'>No pending claims</div>
              ) : (
                claims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedClaim?.id === claim.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <p className='font-mono text-sm text-blue-600 font-medium'>{claim.id}</p>
                    <p className='text-sm text-gray-600 mt-1'>{formatCurrency(claim.amount)}</p>
                    <p className='text-xs text-gray-500 mt-1'>{formatDate(claim.submission_date)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Claim Review */}
          <div className='lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100'>
            {selectedClaim ? (
              <div className='p-6'>
                <div className='flex items-start justify-between mb-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-slate-900'>{selectedClaim.id}</h3>
                    <p className='text-gray-600 text-sm mt-1'>Submitted: {formatDate(selectedClaim.submission_date)}</p>
                  </div>
                  <ClaimStatusBadge status={selectedClaim.status} />
                </div>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-gray-600 text-sm'>Claim Amount</p>
                    <p className='text-2xl font-bold text-slate-900 mt-1'>{formatCurrency(selectedClaim.amount)}</p>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-4 flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm'>Risk Score</p>
                      <p className='text-lg font-bold text-slate-900 mt-1'>
                        {(selectedClaim.risk_score * 100).toFixed(1)}%
                      </p>
                    </div>
                    <RiskGauge score={selectedClaim.risk_score} size='sm' />
                  </div>
                </div>

                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <h4 className='font-semibold text-slate-900 mb-2'>Dates</h4>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-600'>Admission</p>
                      <p className='font-medium text-slate-900'>{formatDate(selectedClaim.admission_date)}</p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Discharge</p>
                      <p className='font-medium text-slate-900'>{formatDate(selectedClaim.discharge_date)}</p>
                    </div>
                  </div>
                </div>

                <div className='mb-6'>
                  <h4 className='font-semibold text-slate-900 mb-3'>Documents</h4>
                  <div className='space-y-2'>
                    {selectedClaim.documents?.map((doc) => (
                      <div key={doc.id} className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                        <div>
                          <p className='text-sm font-medium text-slate-900'>{doc.file_name}</p>
                          <p className='text-xs text-gray-600 font-mono mt-1'>{doc.hash.substring(0, 20)}...</p>
                        </div>
                        {doc.verified ? (
                          <CheckCircle className='w-5 h-5 text-green-600' />
                        ) : (
                          <div className='w-5 h-5 border-2 border-gray-300 rounded-full'></div>
                        )}
                      </div>
                    )) || <p className='text-gray-600 text-sm'>No documents</p>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                  >
                    {actionLoading ? <Loader className='w-5 h-5 animate-spin' /> : <CheckCircle className='w-5 h-5' />}
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                  >
                    {actionLoading ? <Loader className='w-5 h-5 animate-spin' /> : <XCircle className='w-5 h-5' />}
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className='p-6 text-center text-gray-500'>Select a claim to review</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
