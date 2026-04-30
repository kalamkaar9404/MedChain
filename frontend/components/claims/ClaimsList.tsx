'use client'

import { useState } from 'react'
import { useClaims } from '@/hooks/useClaims'
import { ClaimStatusBadge } from '@/components/ui/ClaimStatusBadge'
import { formatCurrency, formatDate, sortClaimsByDate, filterClaimsByStatus } from '@/lib/utils'
import { ClaimStatus } from '@/lib/types'
import { Loader, Search } from 'lucide-react'

export function ClaimsList() {
  const { claims, loading, error, refetch } = useClaims()
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  let filteredClaims = filterClaimsByStatus(claims, statusFilter)
  filteredClaims = sortClaimsByDate(filteredClaims, 'desc')

  if (searchQuery) {
    filteredClaims = filteredClaims.filter((claim) =>
      claim.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (loading && claims.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-8 text-center'>
        <Loader className='w-8 h-8 animate-spin text-blue-600 mx-auto' />
        <p className='text-gray-600 mt-4'>Loading your claims...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
        <p className='text-red-800 font-medium'>Failed to load claims</p>
        <p className='text-red-600 text-sm mt-1'>{error}</p>
        <button
          onClick={refetch}
          className='mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg border border-gray-100'>
      {/* Header with Search and Filter */}
      <div className='p-6 border-b border-gray-100'>
        <div className='flex flex-col md:flex-row gap-4 mb-4 items-center justify-between'>
          <h2 className='text-2xl font-bold text-slate-900'>Your Claims</h2>
          <button
            onClick={refetch}
            disabled={loading}
            className='text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400'
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Search */}
        <div className='relative mb-4'>
          <Search className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search by claim ID...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Status Filter */}
        <div className='flex flex-wrap gap-2'>
          {['ALL', ...Object.values(ClaimStatus)].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as ClaimStatus | 'ALL')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className='overflow-x-auto'>
        {filteredClaims.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            <p>No claims found</p>
          </div>
        ) : (
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Claim ID</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Amount</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Status</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Date</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Risk Score</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 font-mono text-sm text-blue-600'>{claim.id}</td>
                  <td className='px-6 py-4 font-semibold text-slate-900'>{formatCurrency(claim.amount)}</td>
                  <td className='px-6 py-4'>
                    <ClaimStatusBadge status={claim.status} size='sm' />
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600'>{formatDate(claim.submission_date)}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-16 h-2 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${
                            claim.risk_score < 0.33
                              ? 'bg-green-500'
                              : claim.risk_score < 0.66
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${claim.risk_score * 100}%` }}
                        ></div>
                      </div>
                      <span className='text-sm font-medium text-slate-900'>
                        {(claim.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Stats */}
      <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 grid grid-cols-3 gap-4 text-center'>
        <div>
          <p className='text-2xl font-bold text-slate-900'>{filteredClaims.length}</p>
          <p className='text-sm text-gray-600'>Claims</p>
        </div>
        <div>
          <p className='text-2xl font-bold text-green-600'>
            {filteredClaims.filter((c) => c.status === ClaimStatus.APPROVED).length}
          </p>
          <p className='text-sm text-gray-600'>Approved</p>
        </div>
        <div>
          <p className='text-2xl font-bold text-blue-600'>
            {formatCurrency(filteredClaims.reduce((sum, c) => sum + c.amount, 0))}
          </p>
          <p className='text-sm text-gray-600'>Total Value</p>
        </div>
      </div>
    </div>
  )
}
