// Mock data for when API is unavailable or for demo purposes
import { Claim, ClaimStatus, DocumentType, Transaction, Block, Anomaly } from './types'

export const mockClaims: Claim[] = [
  {
    id: 'CLM_DEMO_001',
    patient_id: 'P-001',
    amount: 15000,
    status: ClaimStatus.APPROVED,
    submission_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    admission_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    discharge_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    risk_score: 0.25,
    documents: [
      {
        id: 'DOC_001',
        claim_id: 'CLM_DEMO_001',
        type: DocumentType.MEDICAL_INVOICE,
        hash: '0x1234567890abcdef',
        verified: true,
        upload_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        file_name: 'medical_invoice.pdf',
      },
    ],
    reason: 'Emergency room visit and X-ray imaging',
    signature_verified: true,
    stamp_verified: true,
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'CLM_DEMO_002',
    patient_id: 'P-002',
    amount: 45000,
    status: ClaimStatus.PROCESSING,
    submission_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    admission_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    discharge_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    risk_score: 0.55,
    documents: [],
    reason: 'Surgical procedure with overnight stay',
    signature_verified: true,
    stamp_verified: true,
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'CLM_DEMO_003',
    patient_id: 'P-003',
    amount: 8500,
    status: ClaimStatus.PAID,
    submission_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    admission_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    discharge_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    risk_score: 0.15,
    documents: [],
    reason: 'Routine checkup and lab tests',
    signature_verified: true,
    stamp_verified: true,
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'TX_001',
    claim_id: 'CLM_DEMO_001',
    type: 'CLAIM_SUBMISSION' as any,
    amount: 15000,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    block_number: 1234,
    hash: '0xabcdef1234567890',
    status: 'CONFIRMED',
  },
  {
    id: 'TX_002',
    claim_id: 'CLM_DEMO_003',
    type: 'PAYMENT' as any,
    amount: 8500,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    block_number: 1235,
    hash: '0x1234567890abcdef',
    status: 'CONFIRMED',
  },
]

export const mockBlocks: Block[] = [
  {
    block_number: 1235,
    entries: 3,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    hash: '0xblock1235hash',
    merkle_root: '0xmerkle1235',
    transactions: mockTransactions,
  },
  {
    block_number: 1234,
    entries: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hash: '0xblock1234hash',
    merkle_root: '0xmerkle1234',
    transactions: [],
  },
]

export const mockAnomalies: Anomaly[] = [
  {
    id: 'ANO_001',
    claim_id: 'CLM_DEMO_002',
    type: 'High Amount',
    description: 'Claim amount exceeds typical range for procedure type',
    severity: 'MEDIUM',
    flagged_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    investigation_status: 'PENDING',
  },
]
