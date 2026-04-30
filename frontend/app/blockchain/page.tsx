'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime, truncateHash, timeAgo } from '@/lib/utils'
import { ChevronDown, ChevronUp, Activity, CheckCircle } from 'lucide-react'

// Mock blockchain data
const mockBlockchainData = {
  total_blocks: 1245,
  total_transactions: 5678,
  blocks: [
    {
      block_number: 1245,
      entries: 5,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      hash: '0x7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      merkle_root: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      transactions: [
        {
          id: 'TX_001',
          type: 'CLAIM_SUBMISSION',
          amount: 15000,
          status: 'CONFIRMED',
          claim_id: 'CLM_ABC123',
          block_number: 1245,
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
        {
          id: 'TX_002',
          type: 'PAYMENT',
          amount: 8500,
          status: 'CONFIRMED',
          claim_id: 'CLM_XYZ789',
          block_number: 1245,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      block_number: 1244,
      entries: 3,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      hash: '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      merkle_root: '0x9f0e1d2c3b4a5968778695a4b3c2d1e0f9e8d7c6b5a49382716059483726150',
      transactions: [],
    },
    {
      block_number: 1243,
      entries: 7,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      hash: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
      merkle_root: '0x8e9d0c1b2a39485766758493a2b1c0d9e8f7e6d5c4b3a29180706958473625',
      transactions: [],
    },
  ],
}

const mockTransactions = [
  {
    id: 'TX_001',
    type: 'CLAIM_SUBMISSION',
    claim_id: 'CLM_ABC123',
    amount: 15000,
    block_number: 1245,
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'TX_002',
    type: 'PAYMENT',
    claim_id: 'CLM_XYZ789',
    amount: 8500,
    block_number: 1245,
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'TX_003',
    type: 'VERIFICATION',
    claim_id: 'CLM_DEF456',
    amount: 25000,
    block_number: 1244,
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'TX_004',
    type: 'APPROVAL',
    claim_id: 'CLM_GHI789',
    amount: 12000,
    block_number: 1244,
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'TX_005',
    type: 'CLAWBACK',
    claim_id: 'CLM_JKL012',
    amount: 5000,
    block_number: 1243,
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
]

export default function BlockchainExplorer() {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)
  const blockchain = mockBlockchainData
  const transactions = mockTransactions

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Blockchain Explorer</h1>
          <p className='text-gray-600'>View all transactions and blocks on the HealthClaim network</p>
        </div>

        {/* Health Status */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm'>Blockchain Status</p>
                  <p className='text-2xl font-bold text-slate-900 mt-2'>Healthy</p>
                </div>
                <div className='w-4 h-4 rounded-full bg-green-500'></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm'>Total Blocks</p>
                  <p className='text-3xl font-bold text-slate-900 mt-2'>{blockchain.total_blocks}</p>
                </div>
                <Activity className='w-8 h-8 text-blue-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm'>Total Transactions</p>
                  <p className='text-3xl font-bold text-slate-900 mt-2'>{blockchain.total_transactions}</p>
                </div>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blocks */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='divide-y divide-gray-100'>
              {blockchain.blocks.map((block) => (
                <div key={block.block_number}>
                  <div
                    onClick={() =>
                      setExpandedBlock(expandedBlock === block.block_number ? null : block.block_number)
                    }
                    className='p-4 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <Badge className='bg-blue-100 text-blue-700 px-4 py-2 font-mono font-bold'>
                          Block #{block.block_number}
                        </Badge>
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
                    <div className='px-4 pb-4 bg-gray-50 border-t border-gray-100'>
                      <div className='space-y-4 mt-4'>
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
                        {block.transactions.length > 0 && (
                          <div>
                            <p className='text-sm font-medium text-slate-900 mb-3'>Transactions</p>
                            <div className='space-y-2'>
                              {block.transactions.map((tx) => (
                                <div key={tx.id} className='bg-white p-3 rounded border border-gray-200 text-xs'>
                                  <div className='flex justify-between items-start'>
                                    <div>
                                      <p className='font-mono font-semibold text-blue-600'>{tx.type}</p>
                                      <p className='text-gray-600 mt-1'>{formatCurrency(tx.amount)}</p>
                                    </div>
                                    <Badge
                                      variant={tx.status === 'CONFIRMED' ? 'default' : 'secondary'}
                                      className='bg-green-100 text-green-800'
                                    >
                                      {tx.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {transactions.map((tx) => (
                    <tr key={tx.id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 text-sm font-mono text-blue-600 font-semibold'>{tx.type}</td>
                      <td className='px-6 py-4 text-sm font-mono text-gray-600'>{truncateHash(tx.claim_id)}</td>
                      <td className='px-6 py-4 text-sm font-semibold text-slate-900'>{formatCurrency(tx.amount)}</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>#{tx.block_number}</td>
                      <td className='px-6 py-4'>
                        <Badge variant='default' className='bg-green-100 text-green-800'>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{timeAgo(tx.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
