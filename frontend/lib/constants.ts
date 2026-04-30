import { ClaimStatus, DocumentType } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Status Badge Configuration
export const STATUS_COLORS: Record<ClaimStatus, { bg: string; text: string; border: string }> = {
  [ClaimStatus.SUBMITTED]: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  [ClaimStatus.VERIFIED]: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  [ClaimStatus.PENDING_APPROVAL]: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  [ClaimStatus.APPROVED]: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  [ClaimStatus.REJECTED]: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  [ClaimStatus.UNDER_AUDIT]: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  [ClaimStatus.CLAWED_BACK]: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  [ClaimStatus.PAID]: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  [ClaimStatus.PROCESSING]: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  [ClaimStatus.MANUAL_REVIEW]: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

// Status Labels
export const STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.SUBMITTED]: "Submitted",
  [ClaimStatus.VERIFIED]: "Verified",
  [ClaimStatus.PENDING_APPROVAL]: "Pending Approval",
  [ClaimStatus.APPROVED]: "Approved",
  [ClaimStatus.REJECTED]: "Rejected",
  [ClaimStatus.UNDER_AUDIT]: "Under Audit",
  [ClaimStatus.CLAWED_BACK]: "Clawed Back",
  [ClaimStatus.PAID]: "Paid",
  [ClaimStatus.PROCESSING]: "Processing",
  [ClaimStatus.MANUAL_REVIEW]: "Manual Review",
};

// Document Type Labels
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.MEDICAL_INVOICE]: "Medical Invoice",
  [DocumentType.PRESCRIPTION]: "Prescription",
  [DocumentType.LAB_REPORT]: "Lab Report",
  [DocumentType.DISCHARGE_SUMMARY]: "Discharge Summary",
  [DocumentType.INSURANCE_FORM]: "Insurance Form",
  [DocumentType.RECEIPT]: "Receipt",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Patient endpoints
  SUBMIT_CLAIM: "/api/claims/submit",
  GET_CLAIMS: "/api/claims",
  GET_CLAIM_DETAILS: "/api/claims/:id",
  GET_CLAIM_STATUS: "/api/claims/:id/status",

  // Insurer endpoints
  GET_PENDING_CLAIMS: "/api/insurer/pending-claims",
  VERIFY_CLAIM: "/api/claims/:id/verify",
  APPROVE_CLAIM: "/api/claims/:id/approve",
  REJECT_CLAIM: "/api/claims/:id/reject",
  REQUEST_MANUAL_REVIEW: "/api/claims/:id/manual-review",
  GET_INSURER_STATS: "/api/insurer/stats",

  // Auditor endpoints
  GET_AUDIT_QUEUE: "/api/auditor/queue",
  GET_ANOMALIES: "/api/auditor/anomalies",
  AUDIT_CLAIM: "/api/claims/:id/audit",
  CLAWBACK: "/api/claims/:id/clawback",
  GET_AUDIT_HISTORY: "/api/auditor/history",

  // Blockchain endpoints
  GET_BLOCKCHAIN_STATE: "/api/blockchain/state",
  GET_BLOCKS: "/api/blockchain/blocks",
  GET_TRANSACTIONS: "/api/blockchain/transactions",
  VERIFY_DOCUMENT: "/api/blockchain/verify-document",

  // System endpoints
  GET_HEALTH: "/api/health",
  GET_AGENT_STATE: "/api/agent/state",
  GET_SYSTEM_METRICS: "/api/system/metrics",

  // Demo endpoints
  RUN_DEMO_SCENARIO: "/api/demo/run-scenario",
  GET_DEMO_SCENARIOS: "/api/demo/scenarios",
};

// Risk Score Configuration
export const RISK_SCORE_THRESHOLDS = {
  LOW: 0.33,
  MEDIUM: 0.66,
  HIGH: 1.0,
};

export const RISK_SCORE_COLORS = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-red-600",
};

// Form Validation Rules
export const VALIDATION_RULES = {
  PATIENT_ID_MIN: 1,
  PATIENT_ID_MAX: 50,
  CLAIM_ID_MIN: 1,
  CLAIM_ID_MAX: 100,
  AMOUNT_MIN: 1,
  AMOUNT_MAX: 500000,
  REASON_MIN: 10,
  REASON_MAX: 500,
};

// Polling Configuration
export const POLLING_INTERVALS = {
  CLAIM_STATUS: 3000, // 3 seconds
  DASHBOARD_STATS: 5000, // 5 seconds
  BLOCKCHAIN: 10000, // 10 seconds
  SYSTEM_HEALTH: 30000, // 30 seconds
};

// Demo Scenarios
export const DEMO_SCENARIOS = [
  {
    id: "instant-payment",
    name: "Instant Payment",
    description: "A straightforward claim that gets approved and paid instantly",
    type: "instant_payment" as const,
  },
  {
    id: "clawback",
    name: "Fraud Detection & Clawback",
    description: "A suspicious claim that gets flagged, audited, and clawed back",
    type: "clawback" as const,
  },
  {
    id: "manual-review",
    name: "Manual Review Required",
    description: "A complex claim that requires human review before approval",
    type: "manual_review" as const,
  },
];
