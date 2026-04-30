'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Shield, Clock, CheckCircle, DollarSign, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface MedicalRecord {
  id: string
  type: 'prescription' | 'lab_report' | 'invoice' | 'discharge_summary' | 'insurance_card'
  title: string
  date: string
  provider: string
  amount?: number
  blockchainHash: string
  verified: boolean
  canClaimInsurance: boolean
}

export default function MedicalRecordsPage() {
  const [records] = useState<MedicalRecord[]>([
    {
      id: 'REC_001',
      type: 'invoice',
      title: 'Emergency Room Visit',
      date: '2026-04-25',
      provider: 'City General Hospital',
      amount: 15000,
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef',
      verified: true,
      canClaimInsurance: true,
    },
    {
      id: 'REC_002',
      type: 'prescription',
      title: 'Antibiotic Prescription',
      date: '2026-04-20',
      provider: 'Dr. Sarah Johnson',
      amount: 250,
      blockchainHash: '0x9876543210fedcba',
      verified: true,
      canClaimInsurance: true,
    },
    {
      id: 'REC_003',
      type: 'lab_report',
      title: 'Blood Test Results',
      date: '2026-04-15',
      provider: 'MediLab Diagnostics',
      amount: 500,
      blockchainHash: '0xabcdef1234567890',
      verified: true,
      canClaimInsurance: false,
    },
    {
      id: 'REC_004',
      type: 'discharge_summary',
      title: 'Hospital Discharge Summary',
      date: '2026-04-10',
      provider: 'City General Hospital',
      blockchainHash: '0x567890abcdef1234',
      verified: true,
      canClaimInsurance: false,
    },
  ])

  const [premiumBalance] = useState(2500)
  const [nextPremiumDue] = useState('2026-05-15')
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())
  const [showUploadModal, setShowUploadModal] = useState(false)

  const toggleRecordSelection = (recordId: string) => {
    const newSelection = new Set(selectedRecords)
    if (newSelection.has(recordId)) {
      newSelection.delete(recordId)
    } else {
      newSelection.add(recordId)
    }
    setSelectedRecords(newSelection)
  }

  const handleBulkClaim = () => {
    const selectedAmount = records
      .filter((r) => selectedRecords.has(r.id))
      .reduce((sum, r) => sum + (r.amount || 0), 0)
    
    alert(`Submitting claim for ${selectedRecords.size} records totaling ${formatCurrency(selectedAmount)}`)
    setSelectedRecords(new Set())
  }

  const handlePayPremium = () => {
    alert('Redirecting to premium payment...')
  }

  const totalClaimable = records
    .filter((r) => r.canClaimInsurance && r.amount)
    .reduce((sum, r) => sum + (r.amount || 0), 0)

  const getRecordIcon = (type: string) => {
    return <FileText className='w-5 h-5' />
  }

  const getRecordColor = (type: string) => {
    const colors = {
      invoice: 'bg-blue-50 border-blue-200',
      prescription: 'bg-green-50 border-green-200',
      lab_report: 'bg-purple-50 border-purple-200',
      discharge_summary: 'bg-orange-50 border-orange-200',
      insurance_card: 'bg-gray-50 border-gray-200',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200'
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Medical Records & Blockchain</h1>
          <p className='text-gray-600'>Your complete medical history stored securely on the blockchain</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Total Records</p>
                  <p className='text-3xl font-bold text-slate-900'>{records.length}</p>
                </div>
                <FileText className='w-8 h-8 text-blue-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Claimable Amount</p>
                  <p className='text-2xl font-bold text-green-600'>{formatCurrency(totalClaimable)}</p>
                </div>
                <DollarSign className='w-8 h-8 text-green-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Premium Balance</p>
                  <p className='text-2xl font-bold text-purple-600'>{formatCurrency(premiumBalance)}</p>
                </div>
                <Shield className='w-8 h-8 text-purple-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Next Premium Due</p>
                  <p className='text-lg font-bold text-orange-600'>{formatDate(nextPremiumDue)}</p>
                </div>
                <Clock className='w-8 h-8 text-orange-600' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <Button
            onClick={() => setShowUploadModal(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            <Upload className='w-4 h-4 mr-2' />
            Upload New Record
          </Button>
          <Button
            onClick={handleBulkClaim}
            disabled={selectedRecords.size === 0}
            className='bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400'
          >
            <FileText className='w-4 h-4 mr-2' />
            Submit Claim ({selectedRecords.size} selected)
          </Button>
          <Button onClick={handlePayPremium} className='bg-purple-600 hover:bg-purple-700 text-white'>
            <DollarSign className='w-4 h-4 mr-2' />
            Pay Premium
          </Button>
        </div>

        {/* Medical Records Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {records.map((record) => (
            <Card
              key={record.id}
              className={`cursor-pointer transition-all ${
                selectedRecords.has(record.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => record.canClaimInsurance && toggleRecordSelection(record.id)}
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-3'>
                    <div className={`p-3 rounded-lg ${getRecordColor(record.type)}`}>
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{record.title}</CardTitle>
                      <CardDescription>{record.provider}</CardDescription>
                    </div>
                  </div>
                  {record.verified && (
                    <Badge variant='default' className='bg-green-100 text-green-800 border-green-200'>
                      <CheckCircle className='w-3 h-3 mr-1' />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Date:</span>
                    <span className='font-medium'>{formatDate(record.date)}</span>
                  </div>
                  {record.amount && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Amount:</span>
                      <span className='font-bold text-blue-600'>{formatCurrency(record.amount)}</span>
                    </div>
                  )}
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Blockchain Hash:</span>
                    <span className='font-mono text-xs text-gray-500'>
                      {record.blockchainHash.substring(0, 10)}...
                    </span>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t'>
                    <span className='text-sm text-gray-600'>Insurance Claimable:</span>
                    {record.canClaimInsurance ? (
                      <Badge variant='default' className='bg-green-100 text-green-800'>
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant='secondary'>No</Badge>
                    )}
                  </div>
                  {record.canClaimInsurance && (
                    <div className='pt-2'>
                      <input
                        type='checkbox'
                        checked={selectedRecords.has(record.id)}
                        onChange={() => toggleRecordSelection(record.id)}
                        className='mr-2'
                      />
                      <span className='text-sm text-gray-700'>Select for claim submission</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <Card className='w-full max-w-md'>
              <CardHeader>
                <CardTitle>Upload Medical Record</CardTitle>
                <CardDescription>Add a new document to your blockchain medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Document Type</label>
                    <select className='w-full px-4 py-2 border rounded-lg'>
                      <option>Medical Invoice</option>
                      <option>Prescription</option>
                      <option>Lab Report</option>
                      <option>Discharge Summary</option>
                      <option>Insurance Card</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Document Title</label>
                    <input type='text' className='w-full px-4 py-2 border rounded-lg' placeholder='e.g., X-Ray Report' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Provider Name</label>
                    <input type='text' className='w-full px-4 py-2 border rounded-lg' placeholder='e.g., City Hospital' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Amount (if applicable)</label>
                    <input type='number' className='w-full px-4 py-2 border rounded-lg' placeholder='0.00' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Upload File</label>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-sm text-gray-600'>Click to upload or drag and drop</p>
                      <p className='text-xs text-gray-500 mt-1'>PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  <div className='flex gap-3 pt-4'>
                    <Button
                      onClick={() => {
                        alert('Document uploaded and stored on blockchain!')
                        setShowUploadModal(false)
                      }}
                      className='flex-1 bg-blue-600 hover:bg-blue-700'
                    >
                      Upload to Blockchain
                    </Button>
                    <Button onClick={() => setShowUploadModal(false)} variant='outline' className='flex-1'>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blockchain Info */}
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Security</CardTitle>
            <CardDescription>How your medical records are protected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='flex items-start gap-3'>
                <Shield className='w-6 h-6 text-blue-600 flex-shrink-0' />
                <div>
                  <h4 className='font-semibold text-slate-900 mb-1'>Immutable Storage</h4>
                  <p className='text-sm text-gray-600'>
                    Records cannot be altered or deleted once stored on the blockchain
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0' />
                <div>
                  <h4 className='font-semibold text-slate-900 mb-1'>Verified Authenticity</h4>
                  <p className='text-sm text-gray-600'>
                    Every document is cryptographically verified and timestamped
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <FileText className='w-6 h-6 text-purple-600 flex-shrink-0' />
                <div>
                  <h4 className='font-semibold text-slate-900 mb-1'>Easy Claims</h4>
                  <p className='text-sm text-gray-600'>
                    Submit insurance claims directly from your stored records
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
