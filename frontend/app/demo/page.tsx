'use client'

import { useState } from 'react'
import { useSubmitClaim } from '@/hooks/useClaims'
import { DocumentType, ClaimStatus } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Play, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const demoScenarios = [
  {
    id: 'instant-payment',
    name: 'Instant Payment',
    description: 'A straightforward claim that gets approved and paid instantly',
    sampleClaim: {
      patient_id: 'P-001',
      amount: 15000,
      reason: 'Emergency room visit and X-ray imaging',
      admission_date: '2024-04-20',
      discharge_date: '2024-04-21',
    },
  },
  {
    id: 'clawback',
    name: 'Fraud Detection & Clawback',
    description: 'A suspicious claim that gets flagged, audited, and clawed back',
    sampleClaim: {
      patient_id: 'P-002',
      amount: 250000,
      reason: 'Extended hospitalization with multiple procedures',
      admission_date: '2024-03-01',
      discharge_date: '2024-04-15',
    },
  },
  {
    id: 'manual-review',
    name: 'Manual Review Required',
    description: 'A complex claim that requires human review before approval',
    sampleClaim: {
      patient_id: 'P-003',
      amount: 75000,
      reason: 'Experimental treatment procedure',
      admission_date: '2024-04-01',
      discharge_date: '2024-04-25',
    },
  },
]

interface ProcessingStep {
  step: string
  status: 'pending' | 'completed' | 'error'
  timestamp: string
  details?: string
}

export default function DemoPage() {
  const [selectedScenario, setSelectedScenario] = useState(demoScenarios[0])
  const [isRunning, setIsRunning] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [result, setResult] = useState<any>(null)
  const { submit, loading } = useSubmitClaim()

  const runScenario = async () => {
    setIsRunning(true)
    setProcessingSteps([])
    setResult(null)

    const steps: ProcessingStep[] = [
      { step: 'Claim Submitted', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Extracting Document Hash', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Document Hash Verification', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Risk Score Calculation', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Fraud Detection Analysis', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Policy Compliance Check', status: 'pending', timestamp: new Date().toISOString() },
      { step: 'Final Decision', status: 'pending', timestamp: new Date().toISOString() },
    ]

    // Simulate step-by-step processing
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      steps[i].status = selectedScenario.id === 'clawback' && i > 4 ? 'error' : 'completed'
      setProcessingSteps([...steps])
    }

    // Submit the actual claim
    const payload = {
      patient_id: selectedClaim.patient_id,
      amount: selectedClaim.amount,
      reason: selectedClaim.reason,
      admission_date: selectedClaim.admission_date,
      discharge_date: selectedClaim.discharge_date,
      document_hashes: ['demo_hash_' + Math.random().toString(36).substr(2, 9)],
      document_types: [DocumentType.MEDICAL_INVOICE],
      signature_verified: true,
      stamp_verified: true,
    }

    await submit(payload)

    // Set the result based on scenario
    const finalStatus =
      selectedScenario.id === 'instant-payment'
        ? ClaimStatus.PAID
        : selectedScenario.id === 'clawback'
          ? ClaimStatus.CLAWED_BACK
          : ClaimStatus.MANUAL_REVIEW

    setResult({
      claim_id: `CLM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: finalStatus,
      processingTime: Math.random() * 5 + 2,
      details:
        selectedScenario.id === 'instant-payment'
          ? 'Claim verified and approved automatically. Payment initiated.'
          : selectedScenario.id === 'clawback'
            ? 'Fraudulent pattern detected. Claim flagged for audit. Amount clawed back.'
            : 'Complex claim requiring manual review. Assigned to audit team.',
    })

    setIsRunning(false)
  }

  const selectedClaim = selectedScenario.sampleClaim

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Interactive Demo</h1>
          <p className='text-gray-600'>Watch the platform process different claim scenarios in real-time</p>
        </div>

        {/* Scenario Selection */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario)
                setResult(null)
                setProcessingSteps([])
              }}
              className={`text-left p-6 rounded-lg border-2 transition ${
                selectedScenario.id === scenario.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <h3 className='text-lg font-bold text-slate-900 mb-2'>{scenario.name}</h3>
              <p className='text-sm text-gray-600'>{scenario.description}</p>
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Sample Claim Data */}
          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6'>
            <h3 className='text-xl font-bold text-slate-900 mb-6'>Sample Claim Data</h3>

            <div className='space-y-4 mb-6'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600'>Patient ID</p>
                <p className='text-lg font-mono font-bold text-slate-900 mt-1'>{selectedClaim.patient_id}</p>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600'>Claim Amount</p>
                <p className='text-2xl font-bold text-blue-600 mt-1'>{formatCurrency(selectedClaim.amount)}</p>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-600'>Reason</p>
                <p className='text-sm text-slate-900 mt-1'>{selectedClaim.reason}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='text-sm text-gray-600'>Admission</p>
                  <p className='text-sm font-medium text-slate-900 mt-1'>
                    {formatDate(selectedClaim.admission_date)}
                  </p>
                </div>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='text-sm text-gray-600'>Discharge</p>
                  <p className='text-sm font-medium text-slate-900 mt-1'>
                    {formatDate(selectedClaim.discharge_date)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={runScenario}
              disabled={isRunning || loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2'
            >
              <Play className='w-5 h-5' />
              {isRunning ? 'Running Demo...' : 'Run Demo Scenario'}
            </button>
          </div>

          {/* Processing Steps & Results */}
          <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-6'>
            <h3 className='text-xl font-bold text-slate-900 mb-6'>
              {result ? 'Processing Complete' : 'Processing Steps'}
            </h3>

            {processingSteps.length > 0 && (
              <div className='space-y-3 mb-6'>
                {processingSteps.map((step, index) => (
                  <div key={index} className='flex items-start gap-4'>
                    <div className='flex-shrink-0 mt-1'>
                      {step.status === 'completed' && (
                        <CheckCircle className='w-5 h-5 text-green-600' />
                      )}
                      {step.status === 'pending' && (
                        <Clock className='w-5 h-5 text-yellow-600 animate-spin' />
                      )}
                      {step.status === 'error' && <AlertCircle className='w-5 h-5 text-red-600' />}
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium text-slate-900'>{step.step}</p>
                      <p className='text-xs text-gray-600 mt-1'>
                        {step.status === 'completed'
                          ? 'Completed'
                          : step.status === 'pending'
                            ? 'Processing...'
                            : 'Flagged for audit'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className='p-4 rounded-lg border-2 border-blue-200 bg-blue-50'>
                <div className='flex items-start gap-3 mb-4'>
                  {result.status === ClaimStatus.PAID && (
                    <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0' />
                  )}
                  {result.status === ClaimStatus.CLAWED_BACK && (
                    <AlertCircle className='w-6 h-6 text-red-600 flex-shrink-0' />
                  )}
                  {result.status === ClaimStatus.MANUAL_REVIEW && (
                    <Clock className='w-6 h-6 text-yellow-600 flex-shrink-0' />
                  )}
                  <div>
                    <p className='font-bold text-slate-900'>{result.status}</p>
                    <p className='text-sm text-gray-700 mt-1'>{result.details}</p>
                  </div>
                </div>

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Claim ID:</span>
                    <span className='font-mono font-bold text-blue-600'>{result.claim_id}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Processing Time:</span>
                    <span className='font-bold text-slate-900'>{result.processingTime.toFixed(1)}s</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Amount:</span>
                    <span className='font-bold text-slate-900'>{formatCurrency(selectedClaim.amount)}</span>
                  </div>
                </div>
              </div>
            )}

            {processingSteps.length === 0 && !result && (
              <div className='text-center text-gray-600 py-8'>
                <p>Select a scenario and click "Run Demo" to see the platform in action</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h4 className='font-bold text-slate-900 mb-3'>What This Demo Shows</h4>
            <ul className='text-sm text-gray-600 space-y-2'>
              <li>✓ Real-time claim processing</li>
              <li>✓ Document verification</li>
              <li>✓ Fraud detection</li>
              <li>✓ Automated decision making</li>
            </ul>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h4 className='font-bold text-slate-900 mb-3'>Processing Features</h4>
            <ul className='text-sm text-gray-600 space-y-2'>
              <li>✓ AI-powered verification</li>
              <li>✓ Blockchain recording</li>
              <li>✓ Risk scoring</li>
              <li>✓ Audit trails</li>
            </ul>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h4 className='font-bold text-slate-900 mb-3'>Key Benefits</h4>
            <ul className='text-sm text-gray-600 space-y-2'>
              <li>✓ Seconds not days</li>
              <li>✓ 70% fraud reduction</li>
              <li>✓ Full transparency</li>
              <li>✓ Immutable records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
