import { API_BASE_URL, API_ENDPOINTS } from './constants'
import {
  ApiResponse,
  Claim,
  ClaimSubmissionPayload,
  ClaimsListResponse,
  ClaimDetails,
  BlockchainState,
  AuditRecord,
  ClawbackPayload,
  AgentState,
  SystemHealth,
  DashboardStats,
  ClaimStatus,
  Anomaly,
  Transaction,
} from './types'

class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('[API Error]', endpoint, errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  // Patient Endpoints
  async submitClaim(payload: ClaimSubmissionPayload): Promise<ApiResponse<Claim>> {
    return this.request<Claim>(API_ENDPOINTS.SUBMIT_CLAIM, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getClaims(patientId?: string): Promise<ApiResponse<ClaimsListResponse>> {
    const endpoint = patientId
      ? `${API_ENDPOINTS.GET_CLAIMS}?patient_id=${patientId}`
      : API_ENDPOINTS.GET_CLAIMS
    return this.request<ClaimsListResponse>(endpoint)
  }

  async getClaimDetails(claimId: string): Promise<ApiResponse<ClaimDetails>> {
    const endpoint = API_ENDPOINTS.GET_CLAIM_DETAILS.replace(':id', claimId)
    return this.request<ClaimDetails>(endpoint)
  }

  async getClaimStatus(claimId: string): Promise<ApiResponse<{ status: ClaimStatus }>> {
    const endpoint = API_ENDPOINTS.GET_CLAIM_STATUS.replace(':id', claimId)
    return this.request<{ status: ClaimStatus }>(endpoint)
  }

  // Insurer Endpoints
  async getPendingClaims(): Promise<ApiResponse<ClaimsListResponse>> {
    return this.request<ClaimsListResponse>(API_ENDPOINTS.GET_PENDING_CLAIMS)
  }

  async verifyClaim(claimId: string): Promise<ApiResponse<Claim>> {
    const endpoint = API_ENDPOINTS.VERIFY_CLAIM.replace(':id', claimId)
    return this.request<Claim>(endpoint, { method: 'POST' })
  }

  async approveClaim(claimId: string): Promise<ApiResponse<Claim>> {
    const endpoint = API_ENDPOINTS.APPROVE_CLAIM.replace(':id', claimId)
    return this.request<Claim>(endpoint, { method: 'POST' })
  }

  async rejectClaim(claimId: string, reason: string): Promise<ApiResponse<Claim>> {
    const endpoint = API_ENDPOINTS.REJECT_CLAIM.replace(':id', claimId)
    return this.request<Claim>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async requestManualReview(claimId: string): Promise<ApiResponse<Claim>> {
    const endpoint = API_ENDPOINTS.REQUEST_MANUAL_REVIEW.replace(':id', claimId)
    return this.request<Claim>(endpoint, { method: 'POST' })
  }

  async getInsurerStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(API_ENDPOINTS.GET_INSURER_STATS)
  }

  // Auditor Endpoints
  async getAuditQueue(): Promise<ApiResponse<Claim[]>> {
    return this.request<Claim[]>(API_ENDPOINTS.GET_AUDIT_QUEUE)
  }

  async getAnomalies(): Promise<ApiResponse<Anomaly[]>> {
    return this.request<Anomaly[]>(API_ENDPOINTS.GET_ANOMALIES)
  }

  async auditClaim(claimId: string): Promise<ApiResponse<AuditRecord>> {
    const endpoint = API_ENDPOINTS.AUDIT_CLAIM.replace(':id', claimId)
    return this.request<AuditRecord>(endpoint, { method: 'POST' })
  }

  async clawback(claimId: string, payload: ClawbackPayload): Promise<ApiResponse<AuditRecord>> {
    const endpoint = API_ENDPOINTS.CLAWBACK.replace(':id', claimId)
    return this.request<AuditRecord>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getAuditHistory(): Promise<ApiResponse<AuditRecord[]>> {
    return this.request<AuditRecord[]>(API_ENDPOINTS.GET_AUDIT_HISTORY)
  }

  // Blockchain Endpoints
  async getBlockchainState(): Promise<ApiResponse<BlockchainState>> {
    return this.request<BlockchainState>(API_ENDPOINTS.GET_BLOCKCHAIN_STATE)
  }

  async getBlocks(): Promise<ApiResponse<{ blocks: any[] }>> {
    return this.request<{ blocks: any[] }>(API_ENDPOINTS.GET_BLOCKS)
  }

  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>(API_ENDPOINTS.GET_TRANSACTIONS)
  }

  async verifyDocument(documentId: string): Promise<ApiResponse<{ verified: boolean; hash: string }>> {
    return this.request<{ verified: boolean; hash: string }>(
      `${API_ENDPOINTS.VERIFY_DOCUMENT}?document_id=${documentId}`
    )
  }

  // System Endpoints
  async getHealth(): Promise<ApiResponse<SystemHealth>> {
    return this.request<SystemHealth>(API_ENDPOINTS.GET_HEALTH)
  }

  async getAgentState(): Promise<ApiResponse<AgentState>> {
    return this.request<AgentState>(API_ENDPOINTS.GET_AGENT_STATE)
  }

  async getSystemMetrics(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(API_ENDPOINTS.GET_SYSTEM_METRICS)
  }

  // Demo Endpoints
  async runDemoScenario(scenarioId: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.RUN_DEMO_SCENARIO, {
      method: 'POST',
      body: JSON.stringify({ scenario_id: scenarioId }),
    })
  }

  async getDemoScenarios(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.GET_DEMO_SCENARIOS)
  }
}

export const apiClient = new APIClient()
export default apiClient
