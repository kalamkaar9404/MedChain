'use client'

import { useBlockchain, useTransactions } from '@/hooks/useBlockchain'
import { usePolling } from '@/hooks/usePolling'
import { apiClient } from '@/lib/api'
import { formatCurrency, formatDateTime, truncateHash, timeAgo } from '@/lib/utils'
import { POLLING_INTERVALS } from '@/lib/constants'
import { useState } from 'react'
import { Loader, ChevronDown, ChevronUp } from 'lucide-react'

export default function BlockchainExplorer() {
  const { blockchain, loading } = useBlockchain()
  const { transactions } = useTransactions()
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)

  const { data: health } = usePolling(() => apiClient.getHealth(), {
    interval: POLLING_INTERVALS.SYSTEM_HEALTH,
  })

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <Loader className='w-12 h-12 animate-spin text-blue-600 mx-auto' />
          <p className='text-gray-600 mt-4'>Loading blockchain data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Blockchain Explorer</h1>
          <p className='text-gray-600'>View all transactions and blocks on the HealthClaim network</p>
        </div>

        {/* Health Status */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Blockchain Status</p>
                <p className='text-2xl font-bold text-slate-900 mt-2'>{health?.status || 'Loading...'}</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full ${
                  health?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              ></div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <p className='text-gray-600 text-sm'>Total Blocks</p>
            <p className='text-3xl font-bold text-slate-900 mt-2'>{blockchain?.total_blocks}</p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <p className='text-gray-600 text-sm'>Total Transactions</p>
            <p className='text-3xl font-bold text-slate-900 mt-2'>{blockchain?.total_transactions}</p>
          </div>
        </div>

        {/* Blocks */}
        <div className='bg-white rounded-lg shadow-lg border border-gray-100 mb-8'>
          <div className='p-6 border-b border-gray-100'>
            <h3 className='text-xl font-bold text-slate-900'>Recent Blocks</h3>
          </div>
          <div className='divide-y divide-gray-100'>
            {blockchain?.blocks?.map((block) => (
              <div key={block.block_number} className=''>
                <div
                  onClick={() =>
                    setExpandedBlock(expandedBlock === block.block_number ? null : block.block_number)
                  }
                  className='p-6 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-blue-100 text-blue-700 px-4 py-2 rounded font-mono font-bold'>
                        Block #{block.block_number}
                      </div>
                      <span className='text-sm text-gray-600'>{block.entries} entries</span>
                    </div>
                    <p className='text-xs text-gray-500 mt-2 font-mono'>{formatDateTime(block.timestamp)}</p>
                  </div>
                  <button className='p-2 hover:bg-gray-200 rounded transition'>
                    {expandedBlock === block.block_number ? (
                      <ChevronUp className='w-5 h-5 text-gray-600' />
                    ) : (
                      <ChevronDown className='w-5 h-5 text-gray-600' />
                    )}
                  </button>
                </div>

                {expandedBlock === block.block_number && (
                  <div className='px-6 pb-6 bg-gray-50 border-t border-gray-100'>
                    <div className='space-y-4'>
                      <div>
                        <p className='text-sm font-medium text-slate-900 mb-2'>Block Hash</p>
                        <p className='text-xs font-mono bg-white p-3 rounded border border-gray-200 text-gray-600 break-all'>
                          {block.hash}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-slate-900 mb-2'>Merkle Root</p>
                        <p className='text-xs font-mono bg-white p-3 rounded border border-gray-200 text-gray-600 break-all'>
                          {block.merkle_root}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-slate-900 mb-3'>Transactions</p>
                        <div className='space-y-2'>
                          {block.transactions?.slice(0, 5).map((tx) => (
                            <div key={tx.id} className='bg-white p-3 rounded border border-gray-200 text-xs'>
                              <div className='flex justify-between items-start'>
                                <div>
                                  <p className='font-mono font-semibold text-blue-600'>{tx.type}</p>
                                  <p className='text-gray-600 mt-1'>{formatCurrency(tx.amount)}</p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    tx.status === 'CONFIRMED'
                                      ? 'bg-green-100 text-green-800'
                                      : tx.status === 'PENDING'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          {(block.transactions?.length || 0) > 5 && (
                            <p className='text-gray-600 text-xs mt-2'>
                              ... and {(block.transactions?.length || 0) - 5} more transactions
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className='bg-white rounded-lg shadow-lg border border-gray-100'>
          <div className='p-6 border-b border-gray-100'>
            <h3 className='text-xl font-bold text-slate-900'>Recent Transactions</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Type</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Claim ID</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Amount</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Block</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Status</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Time</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {transactions?.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm font-mono text-blue-600 font-semibold'>{tx.type}</td>
                    <td className='px-6 py-4 text-sm font-mono text-gray-600'>{truncateHash(tx.claim_id)}</td>
                    <td className='px-6 py-4 text-sm font-semibold text-slate-900'>{formatCurrency(tx.amount)}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>#{tx.block_number}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{timeAgo(tx.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
