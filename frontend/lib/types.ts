// Claim Status Enums
export enum ClaimStatus {
  SUBMITTED = "SUBMITTED",
  VERIFIED = "VERIFIED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  UNDER_AUDIT = "UNDER_AUDIT",
  CLAWED_BACK = "CLAWED_BACK",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  MANUAL_REVIEW = "MANUAL_REVIEW",
}

export enum AuditStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FLAGGED = "FLAGGED",
  RESOLVED = "RESOLVED",
}

export enum TransactionType {
  CLAIM_SUBMISSION = "CLAIM_SUBMISSION",
  VERIFICATION = "VERIFICATION",
  APPROVAL = "APPROVAL",
  PAYMENT = "PAYMENT",
  CLAWBACK = "CLAWBACK",
  AUDIT = "AUDIT",
}

export enum DocumentType {
  MEDICAL_INVOICE = "MEDICAL_INVOICE",
  PRESCRIPTION = "PRESCRIPTION",
  LAB_REPORT = "LAB_REPORT",
  DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",
  INSURANCE_FORM = "INSURANCE_FORM",
  RECEIPT = "RECEIPT",
}

// Claim Interfaces
export interface Document {
  id: string;
  claim_id: string;
  type: DocumentType;
  hash: string;
  verified: boolean;
  upload_timestamp: string;
  file_name: string;
}

export interface Claim {
  id: string;
  patient_id: string;
  amount: number;
  status: ClaimStatus;
  submission_date: string;
  admission_date: string;
  discharge_date: string;
  risk_score: number;
  documents: Document[];
  reason: string;
  signature_verified: boolean;
  stamp_verified: boolean;
  updated_at: string;
}

export interface ClaimSubmissionPayload {
  patient_id: string;
  amount: number;
  reason: string;
  admission_date: string;
  discharge_date: string;
  document_hashes: string[];
  document_types: DocumentType[];
  signature_verified: boolean;
  stamp_verified: boolean;
}

export interface ClaimDetails extends Claim {
  verification_details?: {
    verified_at: string;
    verified_by: string;
  };
  audit_details?: {
    audited_at: string;
    audited_by: string;
    findings: string;
  };
}

// Blockchain & Transaction Interfaces
export interface Transaction {
  id: string;
  claim_id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  block_number: number;
  hash: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
}

export interface Block {
  block_number: number;
  entries: number;
  timestamp: string;
  hash: string;
  merkle_root: string;
  transactions: Transaction[];
}

export interface BlockchainState {
  total_blocks: number;
  total_transactions: number;
  latest_block: Block;
  blocks: Block[];
  escrow_balance: number;
}

// Audit & Risk Interfaces
export interface Anomaly {
  id: string;
  claim_id: string;
  type: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  flagged_at: string;
  investigation_status: "PENDING" | "RESOLVED" | "FALSE_POSITIVE";
}

export interface AuditRecord {
  id: string;
  claim_id: string;
  status: AuditStatus;
  anomalies: Anomaly[];
  clawback_amount?: number;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ClawbackPayload {
  claim_id: string;
  amount: number;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// Agent & System Interfaces
export interface AgentDecision {
  claim_id: string;
  decision: "APPROVE" | "REJECT" | "MANUAL_REVIEW" | "AUDIT";
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface AgentMemory {
  recent_decisions: AgentDecision[];
  patterns_observed: string[];
  confidence_average: number;
}

export interface AgentState {
  status: "ACTIVE" | "IDLE" | "PROCESSING";
  memory: AgentMemory;
  processing_claims: number;
  decisions_today: number;
  accuracy_rate: number;
  last_activity: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ClaimsListResponse {
  claims: Claim[];
  total: number;
  processed: number;
  pending: number;
}

export interface DashboardStats {
  total_claims: number;
  approved_claims: number;
  rejected_claims: number;
  pending_claims: number;
  avg_processing_time: number;
  fraud_detection_rate: number;
  escrow_balance: number;
}

// Removed SystemHealth interface - not needed

// Demo Scenario Types
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  type: "instant_payment" | "clawback" | "manual_review";
  sample_claim: Claim;
}

export interface DemoResult {
  scenario_id: string;
  claim_id: string;
  outcome: string;
  processing_steps: {
    step: string;
    status: "pending" | "completed" | "error";
    timestamp: string;
  }[];
  final_status: ClaimStatus;
  total_time_ms: number;
}
